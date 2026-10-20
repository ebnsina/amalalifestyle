/// <reference lib="webworker" />
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

export type Stmt = { sql: string; bind?: (string | number)[] };
// The first message is the wasm file's URL; every later one is a request.
export type Request = { wasm: string } | { id: number; stmts: Stmt[] };
export type Reply = { id: number; rows?: Record<string, unknown>[]; error?: string };

type Db = InstanceType<Awaited<ReturnType<Sqlite3['installOpfsSAHPoolVfs']>>['OpfsSAHPoolDb']>;
type Sqlite3 = Awaited<ReturnType<typeof sqlite3InitModule>>;
let ready: Promise<Db>;

// OPFS SAH pool: a real file on the device, no special server headers. One tab holds it at a time.
// The wasm URL comes from the page so the service worker knows to keep it for offline use.
const open = (wasm: string) =>
	(sqlite3InitModule as (o: { locateFile: () => string }) => Promise<Sqlite3>)({ locateFile: () => wasm })
		.then(async (sqlite3) => {
			const pool = await sqlite3.installOpfsSAHPoolVfs({});
			return new pool.OpfsSAHPoolDb('/amala.db');
		});

// Each request runs in one transaction and answers with the rows of its last statement.
self.onmessage = async ({ data }: MessageEvent<Request>) => {
	if ('wasm' in data) return void (ready = open(data.wasm));
	const { id, stmts } = data;
	try {
		const db = await ready;
		let rows: Record<string, unknown>[] = [];
		db.transaction(() => {
			for (const s of stmts) {
				rows = db.exec({ sql: s.sql, bind: s.bind, rowMode: 'object', returnValue: 'resultRows' });
			}
		});
		postMessage({ id, rows } satisfies Reply);
	} catch (e) {
		postMessage({ id, error: e instanceof Error ? e.message : String(e) } satisfies Reply);
	}
};
