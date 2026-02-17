import type { Koala } from '../types';

export interface KinshipResult {
    coefficient: number;
    paths: string[][]; // Array of paths (array of IDs)
    commonAncestors: string[];
    relationship: string;
}

export function calculateKinship(idA: string, idB: string, koalaMap: Map<string, Koala>): KinshipResult {
    if (idA === idB) return { coefficient: 1, paths: [], commonAncestors: [], relationship: '自分' };

    // 1. Find all ancestors for A and B
    const ancestorsA = getAllAncestors(idA, koalaMap);
    const ancestorsB = getAllAncestors(idB, koalaMap);

    // 2. Find common ancestors
    const commonAncestors = Array.from(ancestorsA.keys()).filter(id => ancestorsB.has(id));

    // 3. Calculate coefficient
    // Simplified Wright's coefficient (ignoring inbreeding of ancestors for now)
    // R = Sum( (1/2)^(n1 + n2) ) for each path via common ancestor

    let coefficient = 0;
    const paths: string[][] = [];

    // Special case: Direct Parent/Child
    const a = koalaMap.get(idA);
    const b = koalaMap.get(idB);

    if (a && (a.mother_id === idB || a.father_id === idB)) {
        coefficient += 0.5;
        paths.push([idA, idB]);
    }
    if (b && (b.mother_id === idA || b.father_id === idA)) {
        coefficient += 0.5;
        paths.push([idB, idA]);
    }

    // Path via common ancestors
    // Warning: This simple summing can double count if ancestors are related.
    // Correct way is Path Counting on the pedigree graph.

    for (const ancestorId of commonAncestors) {
        const pathA = getPathToAncestor(idA, ancestorId, koalaMap);
        const pathB = getPathToAncestor(idB, ancestorId, koalaMap);

        // Depth (generations)
        // n1 = pathA.length - 1
        // n2 = pathB.length - 1
        const n1 = pathA.length - 1;
        const n2 = pathB.length - 1;

        // Contribution = (1/2)^(n1 + n2)
        coefficient += Math.pow(0.5, n1 + n2);

        paths.push([...pathA, ...pathB.reverse().slice(1)]);
    }

    // Cap at 1 (though theoretically shouldn't exceed unless self)
    if (coefficient > 1) coefficient = 1;

    return {
        coefficient,
        paths,
        commonAncestors,
        relationship: getRelationshipName(coefficient)
    };
}

function getAllAncestors(id: string, map: Map<string, Koala>, visited = new Set<string>()): Set<string> {
    const koala = map.get(id);
    if (!koala) return visited;

    if (koala.mother_id && !visited.has(koala.mother_id)) {
        visited.add(koala.mother_id);
        getAllAncestors(koala.mother_id, map, visited);
    }
    if (koala.father_id && !visited.has(koala.father_id)) {
        visited.add(koala.father_id);
        getAllAncestors(koala.father_id, map, visited);
    }
    return visited;
}

function getPathToAncestor(start: string, target: string, map: Map<string, Koala>): string[] {
    // BFS
    const queue: [string, string[]][] = [[start, [start]]];
    const visited = new Set<string>();

    while (queue.length > 0) {
        const [currentId, path] = queue.shift()!;
        if (currentId === target) return path;

        visited.add(currentId);
        const koala = map.get(currentId);
        if (!koala) continue;

        if (koala.mother_id && !visited.has(koala.mother_id)) {
            queue.push([koala.mother_id, [...path, koala.mother_id]]);
        }
        if (koala.father_id && !visited.has(koala.father_id)) {
            queue.push([koala.father_id, [...path, koala.father_id]]);
        }
    }
    return [];
}

function getRelationshipName(coeff: number): string {
    if (coeff >= 0.5) return '親子 / きょうだい (0.5)';
    if (coeff >= 0.25) return 'おじ・おば / 祖父母 / 半きょうだい (0.25)';
    if (coeff >= 0.125) return 'いとこ (0.125)';
    if (coeff > 0) return '遠縁';
    return '血縁なし';
}
