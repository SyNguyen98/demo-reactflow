import type {Phase} from "./Phase.ts";

/**
 * Extracts all unique branched paths from a list of phases.
 *
 * This function processes a list of `Phase` objects to identify unique paths
 * based on their milestone relationships. It maps each phase to its previous
 * milestone, finds the starting phase, and recursively traverses all possible
 * paths. Only unique paths with a length greater than 2 are included in the result.
 *
 * @param {Phase[]} phaseList - The list of phases to process.
 * @returns {Phase[][]} - An array of unique paths, where each path is an array of `Phase` objects.
 */
export function extractBranchedPaths(phaseList: Phase[]): Phase[][] {
    // Return an empty array if the input list is null, undefined, or empty.
    if (!phaseList?.length) return [];

    // Map to group phases by their previous milestone ID.
    const milestoneToPhasesMap = new Map<string, Phase[]>();
    // Array to store all possible paths.
    const allPaths: Phase[][] = [];

    // Populate the milestone-to-phases map.
    phaseList.forEach(phase => {
        const key = phase.previousMilestoneId;
        if (!milestoneToPhasesMap.has(key)) {
            milestoneToPhasesMap.set(key, []);
        }
        milestoneToPhasesMap.get(key)!.push(phase);
    });

    // Identify all next milestone IDs and find the starting phase.
    const allNextIds = new Set(phaseList.map(p => p.nextMilestoneId));
    const startPhase = phaseList.find(p => !allNextIds.has(p.previousMilestoneId));

    // If no starting phase is found, log an error and return an empty array.
    if (!startPhase) {
        console.error("Error: Could not find a unique starting phase. Check for a broken chain.");
        return [];
    }

    /**
     * Recursively finds all paths starting from the given phase.
     *
     * @param {Phase} currentPhase - The current phase in the traversal.
     * @param {Phase[]} currentPath - The path traversed so far.
     */
    const findAllPaths = (currentPhase: Phase, currentPath: Phase[] = []): void => {
        // Create a new path by appending the current phase.
        const newPath = [...currentPath, currentPhase];
        // Get the next phases based on the current phase's next milestone ID.
        const nextPhases = milestoneToPhasesMap.get(currentPhase.nextMilestoneId);

        // If there are no next phases, add the current path to allPaths and return.
        if (!nextPhases?.length) {
            allPaths.push(newPath);
            return;
        }

        // Recursively process each next phase.
        nextPhases.forEach(nextPhase => findAllPaths(nextPhase, newPath));
    };

    // Start finding all paths from the starting phase.
    findAllPaths(startPhase);

    // Map to store unique paths as strings for deduplication.
    const uniquePaths = new Map<string, Phase[]>();
    allPaths.forEach(path => {
        // Create a string representation of the path for uniqueness.
        const pathString = path.map(p => p.name).join('->');
        // Add the path to uniquePaths if it is not already present and has a length > 2.
        if (path.length > 2 && !uniquePaths.has(pathString)) {
            uniquePaths.set(pathString, path);
        }
    });

    // Return the unique paths as an array.
    return Array.from(uniquePaths.values());
}

export const sortPhasesByLength = (phases: (Phase[])[]) => {
    return [...phases].sort((a, b) => {
        return a.length - b.length;
    });
};