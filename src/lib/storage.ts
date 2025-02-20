import objectHash from 'object-hash';
import type { IdlessFuizConfig, IdlessMultipleChoiceSlide, Image, Media, Modify } from './types';
import { retrieveRemoteSync, type RemoteSync } from './remoteStorage';

export function generateUuid(): string {
	function generateRandomHex(length: number): string {
		function convertToHex(value: number, length: number): string {
			return value.toString(16).padStart(length, '0');
		}

		function convertUint8ArrayToHex(values: Uint8Array): string {
			return [...values].map((v) => convertToHex(v, 2)).join('');
		}

		const values = new Uint8Array(length / 2);
		crypto.getRandomValues(values);

		return convertUint8ArrayToHex(values);
	}

	function splitString(value: string, lengths: number[]): string[] {
		return lengths.reduce<{ value: string; res: string[] }>(
			({ value, res }, length) => {
				return {
					res: [...res, value.slice(0, length)],
					value: value.slice(length)
				};
			},
			{ value, res: [] }
		).res;
	}

	try {
		return crypto.randomUUID();
	} catch (e) {
		return splitString(generateRandomHex(32), [8, 4, 4, 4, 12]).join('-');
	}
}

export type LocalDatabase = IDBDatabase;
export type CreationId = number;

export type Database = {
	local: LocalDatabase;
	remotes: RemoteSync[];
};

export type Creation = {
	id: CreationId;
	title: string;
	lastEdited: number;
	slidesCount: number;
	media?: Media | undefined;
};

export type ExportedFuiz = {
	config: IdlessFuizConfig;
	uniqueId: string;
	versionId: number;
	lastEdited: number;
	publish?: {
		released_r2_key?: string;
		pending_r2_key?: string;
	};
};

type MediaReference =
	| {
			Image:
				| Image
				| {
						HashReference: {
							hash: string;
							alt: string;
						};
				  };
	  }
	| string;

type MediaReferencedMultipleChoiceSlide = Modify<
	IdlessMultipleChoiceSlide,
	{
		media?: MediaReference;
	}
>;

type MediaReferencedSlide = {
	MultipleChoice: MediaReferencedMultipleChoiceSlide;
};

export type MediaReferencedFuizConfig = Modify<
	IdlessFuizConfig,
	{
		slides: MediaReferencedSlide[];
	}
>;

export type InternalFuiz = {
	config: MediaReferencedFuizConfig;
} & InternalFuizMetadata;

export type InternalFuizMetadata = {
	lastEdited: number;
	uniqueId?: string;
	versionId?: number;
	publish?: {
		released_r2_key?: string;
		pending_r2_key?: string;
	};
};

export type StrictInternalFuiz = {
	config: MediaReferencedFuizConfig;
} & StrictInternalFuizMetadata;

export type StrictInternalFuizMetadata = Modify<
	InternalFuizMetadata,
	{
		uniqueId: string;
		versionId: number;
	}
>;

export type StrictInternalFuizMetadataStrings = Modify<
	StrictInternalFuizMetadata,
	{
		lastEdited: string;
		versionId: string;
	}
>;

export function hashMedia(media: Media): [string, string, Media | string] {
	if ('Base64' in media.Image) {
		const hash = media.Image.Base64.hash ?? objectHash(media.Image.Base64.data);
		return [hash, media.Image.Base64.alt, media.Image.Base64.data];
	} else if ('Corkboard' in media.Image) {
		return [media.Image.Corkboard.id, media.Image.Corkboard.alt, media];
	} else {
		return [media.Image.Url.url, media.Image.Url.alt, media];
	}
}

async function hashExists(hash: string, database: LocalDatabase): Promise<boolean> {
	const imagesStore = database.transaction(['images'], 'readwrite').objectStore('images');
	const request = imagesStore.count(hash);
	return await new Promise((resolve) => {
		request.addEventListener('success', () => {
			resolve(request.result > 0);
		});
	});
}

export async function updateLocalImagesDatabse(
	media: Media | string,
	hash: string,
	database: LocalDatabase
): Promise<boolean> {
	if (!(await hashExists(hash, database))) {
		const imagesStore = database.transaction(['images'], 'readwrite').objectStore('images');
		imagesStore.add(media, hash);
		return true;
	}
	return false;
}

async function updateImagesDatabse(media: Media | string, hash: string, database: Database) {
	if (await updateLocalImagesDatabse(media, hash, database.local)) {
		database.remotes.forEach((db) => {
			db.createImage(hash, media);
		});
	}
}

export function internalizeMedia(
	media: Media | undefined,
	database: Database
): MediaReference | undefined {
	if (media == undefined) return undefined;
	const [hash, alt, newMedia] = hashMedia(media);
	updateImagesDatabse(newMedia, hash, database);
	return {
		Image: {
			HashReference: {
				hash,
				alt
			}
		}
	};
}

function internalizeFuiz(fuiz: ExportedFuiz, database: Database): InternalFuiz {
	return {
		...fuiz,
		config: {
			...fuiz.config,
			slides: fuiz.config.slides.map((slide) => ({
				MultipleChoice: {
					...slide.MultipleChoice,
					media: internalizeMedia(slide.MultipleChoice.media, database)
				}
			}))
		}
	};
}

export async function retrieveMediaFromLocal(
	hash: string,
	database: LocalDatabase,
	alt?: string
): Promise<Media | undefined> {
	const imagesStore = database.transaction(['images'], 'readonly').objectStore('images');
	const transaction = imagesStore.get(hash);

	return await new Promise((resolve) => {
		transaction.addEventListener('success', () => {
			const value: Media | string | undefined = transaction.result ?? undefined;
			if (!value) resolve(undefined);
			else if (typeof value === 'string') {
				resolve({
					Image: {
						Base64: {
							data: value,
							alt: alt ?? ''
						}
					}
				});
			} else {
				resolve(value);
			}
		});
	});
}

async function collectMedia(
	media: MediaReference | undefined,
	database: LocalDatabase
): Promise<Media | undefined> {
	if (media == undefined) return undefined;
	if (typeof media === 'string') {
		return await retrieveMediaFromLocal(media, database);
	} else if ('HashReference' in media.Image) {
		return await retrieveMediaFromLocal(
			media.Image.HashReference.hash,
			database,
			media.Image.HashReference.alt
		);
	} else {
		return {
			Image: media.Image
		};
	}
}

async function collectFuiz(fuiz: InternalFuiz, database: LocalDatabase): Promise<ExportedFuiz> {
	return {
		...fuiz,
		uniqueId: fuiz.uniqueId ?? generateUuid(),
		versionId: fuiz.versionId ?? 0,
		config: {
			...fuiz.config,
			slides: await Promise.all(
				fuiz.config.slides.map(async (slide) =>
					slide.MultipleChoice.media
						? {
								MultipleChoice: {
									...slide.MultipleChoice,
									media: await collectMedia(slide.MultipleChoice.media, database)
								}
						  }
						: {
								MultipleChoice: {
									introduce_question: slide.MultipleChoice.introduce_question,
									time_limit: slide.MultipleChoice.time_limit,
									points_awarded: slide.MultipleChoice.points_awarded,
									answers: slide.MultipleChoice.answers,
									title: slide.MultipleChoice.title
								}
						  }
				)
			)
		}
	};
}

export async function loadDatabase(remote: { google: boolean | undefined; oauth: boolean | undefined }): Promise<Database> {
	const request = indexedDB.open('FuizDB', 2);
    
	
	request.addEventListener('upgradeneeded', (event) => {
		const db = request.result;
		console.log(db);

		if (event.oldVersion != 1) {
			db.createObjectStore('creations', { autoIncrement: true });
		}
		db.createObjectStore('images');
	});

	return await new Promise((resolve, reject) => {
		request.addEventListener('success', () => {
			const remotes = [];
			if (remote.google) {
				remotes.push(retrieveRemoteSync('google'));
			}
			if (remote.oauth) {
				remotes.push(retrieveRemoteSync('oauth'));
			}
			resolve({
				local: request.result,
				remotes
			});
		});
		request.addEventListener('error', reject);
	});
}

// export async function sync(database: Database) {
// 	for (const remote of database.remotes) {
// 		await remote.sync(
// 			database.local,
// 			(await getAllCreationsLocal(database.local)).map(([k, v]) => [parseInt(k.toString()), v])
// 		);
// 	}
// }

export async function getAllCreationsLocal(
	database: LocalDatabase
): Promise<[IDBValidKey, StrictInternalFuiz][]> {
	const creationsStore = database.transaction(['creations'], 'readwrite').objectStore('creations');

	const creationsTransaction = creationsStore.openCursor();

	return await new Promise((resolve) => {
		const internals: [IDBValidKey, StrictInternalFuiz][] = [];

		creationsTransaction.addEventListener('success', async () => {
			const cursor = creationsTransaction.result;
			if (cursor) {
				const value = cursor.value as InternalFuiz;
				const strictValue: StrictInternalFuiz = {
					config: value.config,
					lastEdited: value.lastEdited,
					uniqueId: value.uniqueId ?? generateUuid(),
					versionId: value.versionId ?? 0,
					publish: value.publish
				};
				cursor.update(strictValue);
				internals.push([cursor.key, strictValue]);
				cursor.continue();
			} else {
				resolve(internals);
			}
		});
	});
}

export async function getAllCreations(database: Database): Promise<Creation[]> {
	// await sync(database);

	const internals = await getAllCreationsLocal(database.local);

	return await Promise.all(
		internals.map(async ([key, f]) => {
			const value = await collectFuiz(f, database.local);
			return {
				id: parseInt(key.toString()),
				lastEdited: value.lastEdited,
				title: value.config.title,
				slidesCount: value.config.slides.length,
				media: value.config.slides.reduce<Media | undefined>(
					(p, c) => p || c.MultipleChoice.media,
					undefined
				)
			};
		})
	);
}

export async function getCreationLocal(
	id: CreationId,
	database: LocalDatabase
): Promise<InternalFuiz | undefined> {
	const creationsStore = database.transaction(['creations'], 'readonly').objectStore('creations');
    
	const creationsTransaction = creationsStore.get(id);
    console.log(creationsTransaction);
	return await new Promise((resolve) => {
		creationsTransaction.addEventListener('success', async () => {
            console.log(" hello succes");
            
			resolve(creationsTransaction.result ?? undefined);
		});
	});
}

export async function getCreation(
	id: CreationId,
	database: Database
): Promise<ExportedFuiz | undefined> {
	const internal = await getCreationLocal(id, database.local);
    console.log(internal);
    
	return internal ? await collectFuiz(internal, database.local) : undefined;
}

export async function deleteCreationLocal(id: CreationId, database: LocalDatabase): Promise<void> {
	const creationsStore = database.transaction(['creations'], 'readwrite').objectStore('creations');

	const request = creationsStore.delete(id);

	return await new Promise((resolve) => {
		request.addEventListener('success', () => {
			resolve(undefined);
		});
		request.addEventListener('error', () => {
			resolve(undefined);
		});
	});
}

export async function deleteCreation(id: CreationId, database: Database): Promise<void> {
	const uniqueId = (await getCreation(id, database))?.uniqueId;
	if (!uniqueId) return;
	await deleteCreationLocal(id, database.local);
	database.remotes.forEach((db) => db.delete(uniqueId));
}

export async function addCreationLocal(
	internalFuiz: InternalFuiz,
	database: LocalDatabase
): Promise<CreationId> {
	const creationsStore = database.transaction(['creations'], 'readwrite').objectStore('creations');

	const request = creationsStore.put(internalFuiz);

	return await new Promise((resolve) => {
		request.addEventListener('success', () => {
			resolve(parseInt(request.result.toString()));
		});
	});
}

export async function addCreation(newSlide: ExportedFuiz, database: Database): Promise<CreationId> {
	const internalFuiz = internalizeFuiz(newSlide, database);
	const id = await addCreationLocal(internalFuiz, database.local);
	database.remotes.forEach((db) => db.create(newSlide.uniqueId, internalFuiz));
	return id;
}

export async function updateCreationLocal(
	id: CreationId,
	internalFuiz: InternalFuiz,
	database: LocalDatabase
): Promise<void> {
	const creationsStore = database.transaction(['creations'], 'readwrite').objectStore('creations');
	const request = creationsStore.put(internalFuiz, id);

	return await new Promise((resolve) => {
		request.addEventListener('success', () => {
			resolve(undefined);
		});
	});
}

export async function updateCreation(
	id: CreationId,
	newSlide: ExportedFuiz,
	database: Database
): Promise<void> {
	const internalFuiz = internalizeFuiz(newSlide, database);
	await updateCreationLocal(id, internalFuiz, database.local);
	database.remotes.forEach((db) => db.update(newSlide.uniqueId, internalFuiz));
}
