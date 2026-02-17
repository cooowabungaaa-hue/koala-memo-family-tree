import Papa from 'papaparse';
import type { Koala } from '../types';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQi6GZ0pWmE1A0MSJBoSyHYaKvAHkgFeBRvZPmMHqHLBh53VzAr5nyJ43qOVuTj4y2xus5nzzurKmUX/pub?output=csv';

export async function fetchKoalaData(): Promise<Koala[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(CSV_URL, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length) {
                    console.error('CSV Parsing errors:', results.errors);
                }

                // Post-process data
                const rawData = results.data as any[];
                const koalaMap = new Map<string, Koala>();

                // First pass: Create objects
                rawData.forEach((row) => {
                    if (!row.id) return;

                    koalaMap.set(row.id, {
                        ...row,
                        isAlive: !row.death,
                        children: []
                    });
                });

                // Second pass: Link children
                koalaMap.forEach((koala) => {
                    if (koala.mother_id && koalaMap.has(koala.mother_id)) {
                        koalaMap.get(koala.mother_id)!.children.push(koala.id);
                    }
                    if (koala.father_id && koalaMap.has(koala.father_id)) {
                        koalaMap.get(koala.father_id)!.children.push(koala.id);
                    }
                });

                resolve(Array.from(koalaMap.values()));
            },
            error: (error) => {
                reject(error);
            }
        });
    });
}
