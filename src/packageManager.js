// ====================================
// PACKAGE HASH TABLE
// ====================================

export class PackageHashTable {

    constructor() {

        // JavaScript Map will act as our
        // hash table
        this.table = new Map();
    }


    // --------------------------------
    // ADD PACKAGE
    // --------------------------------

    addPackage(
        packageId,
        nodeId,
        packageName
    ) {

        this.table.set(
            packageId,
            {
                id: packageId,
                nodeId: nodeId,
                name: packageName
            }
        );
    }


    // --------------------------------
    // FIND PACKAGE
    // --------------------------------

    findPackage(packageId) {

        return this.table.get(
            packageId
        );
    }


    // --------------------------------
    // CHECK PACKAGE
    // --------------------------------

    hasPackage(packageId) {

        return this.table.has(
            packageId
        );
    }


    // --------------------------------
    // REMOVE PACKAGE
    // --------------------------------

    removePackage(packageId) {

        return this.table.delete(
            packageId
        );
    }


    // --------------------------------
    // DISPLAY ALL PACKAGES
    // --------------------------------

    displayPackages() {

        console.log(
            "========== PACKAGE HASH TABLE =========="
        );


        for (
            const [
                packageId,
                package
            ] of this.table
        ) {

            console.log(
                `${packageId} → Node ${package.nodeId} → ${package.name}`
            );
        }


        console.log(
            "========================================"
        );
    }
}