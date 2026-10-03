    import * as THREE from "three";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

    // ============================================================
    // 1. SCENE
    // ============================================================

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08111d);

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        200
    );

    camera.position.set(25, 22, 28);

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";

    document.body.appendChild(renderer.domElement);

    // ============================================================
    // 2. CAMERA
    // ============================================================

    const controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 0, 0);
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 8;
    controls.maxDistance = 65;

    // ============================================================
    // 3. LIGHTING
    // ============================================================

    scene.add(
        new THREE.AmbientLight(
            0xffffff,
            1.1
        )
    );

    const mainLight = new THREE.DirectionalLight(
        0xffffff,
        1.8
    );

    mainLight.position.set(5, 25, 10);
    mainLight.castShadow = true;

    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;

    mainLight.shadow.camera.left = -35;
    mainLight.shadow.camera.right = 35;
    mainLight.shadow.camera.top = 35;
    mainLight.shadow.camera.bottom = -25;

    scene.add(mainLight);

    const blueLight = new THREE.PointLight(
        0x2196f3,
        35,
        35
    );

    blueLight.position.set(10, 8, 10);
    scene.add(blueLight);

    // ============================================================
    // 4. FLOOR
    // ============================================================

    const floor = new THREE.Mesh(
        new THREE.BoxGeometry(30, 0.3, 28),
        new THREE.MeshStandardMaterial({
            color: 0x202830,
            roughness: 0.8
        })
    );

    floor.position.set(0, -0.15, 0);
    floor.receiveShadow = true;

    scene.add(floor);

    const gridHelper = new THREE.GridHelper(
        30,
        30,
        0x44505c,
        0x293039
    );

    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // ============================================================
    // 5. LABEL FUNCTION
    // ============================================================

    function createLabel(
        text,
        x,
        y,
        z,
        scale = 2
    ) {

        const canvas = document.createElement("canvas");

        canvas.width = 512;
        canvas.height = 128;

        const context = canvas.getContext("2d");

        context.fillStyle = "rgba(0,0,0,0.75)";

        if (context.roundRect) {

            context.beginPath();

            context.roundRect(
                5,
                5,
                502,
                118,
                15
            );

            context.fill();

        } else {

            context.fillRect(
                5,
                5,
                502,
                118
            );
        }

        context.font = "bold 42px Arial";
        context.fillStyle = "#ffffff";
        context.textAlign = "center";
        context.textBaseline = "middle";

        context.fillText(
            text,
            256,
            64
        );

        const texture = new THREE.CanvasTexture(
            canvas
        );

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });

        const sprite = new THREE.Sprite(
            material
        );

        sprite.position.set(
            x,
            y,
            z
        );

        sprite.scale.set(
            scale,
            scale * 0.25,
            1
        );

        scene.add(sprite);

        return sprite;
    }

    // ============================================================
    // 6. WALLS
    // ============================================================

    const wallMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x18222d
        });

    function createWall(
        x,
        y,
        z,
        width,
        height,
        depth
    ) {

        const wall = new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                height,
                depth
            ),
            wallMaterial
        );

        wall.position.set(
            x,
            y,
            z
        );

        wall.castShadow = true;
        wall.receiveShadow = true;

        scene.add(wall);
    }

    createWall(
        0,
        4,
        -14,
        30,
        8,
        0.4
    );

    createWall(
        -15,
        4,
        0,
        0.4,
        8,
        28
    );

    createWall(
        15,
        4,
        0,
        0.4,
        8,
        28
    );

    // ============================================================
    // 7. RACKS
    // ============================================================

    const racks = {};

    const rackFrameMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x45515d,
            metalness: 0.6,
            roughness: 0.35
        });

    const rackShelfMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x303a44,
            metalness: 0.4,
            roughness: 0.5
        });

    const rackBackMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x26313b
        });

    function createRack(
        rackId,
        x,
        z
    ) {

        const rack = new THREE.Group();

        const pillarGeometry =
            new THREE.BoxGeometry(
                0.16,
                3.4,
                0.16
            );

        const pillarPositions = [
            [-1.9, 1.7, -0.45],
            [1.9, 1.7, -0.45]
        ];

        pillarPositions.forEach(
            position => {

                const pillar = new THREE.Mesh(
                    pillarGeometry,
                    rackFrameMaterial
                );

                pillar.position.set(
                    position[0],
                    position[1],
                    position[2]
                );

                pillar.castShadow = true;

                rack.add(pillar);
            }
        );

        const shelfGeometry =
            new THREE.BoxGeometry(
                4,
                0.18,
                1
            );

        const shelfHeights = [
            0.65,
            1.65,
            2.65
        ];

        const shelves = {};

        shelfHeights.forEach(
            (height, index) => {

                const shelf = new THREE.Mesh(
                    shelfGeometry,
                    rackShelfMaterial
                );

                shelf.position.set(
                    0,
                    height,
                    0
                );

                shelf.castShadow = true;
                shelf.receiveShadow = true;

                rack.add(shelf);

                shelves[index + 1] = height;
            }
        );

        const back = new THREE.Mesh(
            new THREE.BoxGeometry(
                4,
                3.2,
                0.12
            ),
            rackBackMaterial
        );

        back.position.set(
            0,
            1.7,
            -0.45
        );

        rack.add(back);

        rack.position.set(
            x,
            0,
            z
        );

        scene.add(rack);

        createLabel(
            rackId,
            x,
            4.1,
            z + 0.8,
            2.6
        );

        racks[rackId] = {
            id: rackId,
            x: x,
            z: z,
            shelves: shelves,
            group: rack
        };
    }

    createRack("RACK-A", -8, -8);
    createRack("RACK-B", -2, -8);
    createRack("RACK-C", 4, -8);

    createRack("RACK-D", -8, 0);
    createRack("RACK-E", -2, 0);
    createRack("RACK-F", 4, 0);

    // ============================================================
    // 8. AISLES
    // ============================================================

    const aisleMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x3b444d,
            roughness: 0.8
        });

    function createAisle(
        x,
        z,
        width,
        depth
    ) {

        const aisle = new THREE.Mesh(
            new THREE.BoxGeometry(
                width,
                0.025,
                depth
            ),
            aisleMaterial
        );

        aisle.position.set(
            x,
            0.02,
            z
        );

        scene.add(aisle);
    }

    createAisle(0, -4, 26, 2);
    createAisle(0, 4, 26, 2);

    createAisle(-11, 0, 2, 26);
    createAisle(-5, 0, 2, 26);
    createAisle(1, 0, 2, 26);
    createAisle(7, 0, 2, 26);

    // ============================================================
    // 9. HASH TABLE
    // ============================================================

    class PackageHashTable {

        constructor() {
            this.table = new Map();
        }

        addPackage(
            id,
            name,
            rack,
            shelf,
            position,
            pickupNode
        ) {

            this.table.set(
                id,
                {
                    id,
                    name,
                    rack,
                    shelf,
                    position,
                    pickupNode,
                    status: "ON_RACK"
                }
            );
        }

        getPackage(id) {
            return this.table.get(id);
        }

        getAllPackages() {
            return Array.from(
                this.table.values()
            );
        }
    }

    const packageTable =
        new PackageHashTable();

    const packageMeshes = {};
    const packageLabels = {};

    const packageColors = {

        "PKG-001": 0xff4d4d,

        "PKG-002": 0x3399ff,

        "PKG-003": 0xffcc33,

        "PKG-004": 0x33dd88,

        "PKG-005": 0xff8844,

        "PKG-006": 0xaa66ff
    };

    // ============================================================
    // 10. STATIC BOX
    // ============================================================

    function createStaticBox(
        rackId,
        shelf,
        xOffset,
        boxColor
    ) {

        const rack =
            racks[rackId];

        const shelfHeight =
            rack.shelves[shelf];

        const box = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.58,
                0.55,
                0.62
            ),
            new THREE.MeshStandardMaterial({
                color: boxColor,
                roughness: 0.65
            })
        );

        box.position.set(
            rack.x + xOffset,
            shelfHeight + 0.36,
            rack.z + 0.18
        );

        box.castShadow = true;
        box.receiveShadow = true;

        scene.add(box);
    }

    // ============================================================
    // 11. SPECIAL PACKAGE
    // ============================================================

    function createSpecialPackage(
        id,
        name,
        rackId,
        shelf,
        pickupNode,
        xOffset
    ) {

        const rack =
            racks[rackId];

        const shelfHeight =
            rack.shelves[shelf];

        const x =
            rack.x + xOffset;

        const y =
            shelfHeight + 0.38;

        const z =
            rack.z + 0.18;

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                0.68,
                0.62,
                0.68
            ),
            new THREE.MeshStandardMaterial({
                color: packageColors[id],
                roughness: 0.5
            })
        );

        mesh.position.set(
            x,
            y,
            z
        );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        scene.add(mesh);

        packageMeshes[id] =
            mesh;

        packageTable.addPackage(
            id,
            name,
            rackId,
            shelf,
            {
                x,
                y,
                z
            },
            pickupNode
        );

        packageLabels[id] =
            createLabel(
                id,
                x,
                y + 0.65,
                z + 0.1,
                1.25
            );
    }

    // ============================================================
    // 12. FILL ALL RACKS
    // ============================================================

    const specialLocations = {

        "RACK-A": [
            {
                shelf: 2,
                xOffset: -0.75
            }
        ],

        "RACK-B": [],

        "RACK-C": [
            {
                shelf: 1,
                xOffset: 0.75
            }
        ],

        "RACK-D": [
            {
                shelf: 1,
                xOffset: -0.75
            },
            {
                shelf: 2,
                xOffset: 0.75
            }
        ],

        "RACK-E": [
            {
                shelf: 1,
                xOffset: -0.75
            }
        ],

        "RACK-F": [
            {
                shelf: 2,
                xOffset: 0.75
            }
        ]
    };

    function fillRack(
        rackId,
        specialLocationsForRack
    ) {

        const positions = [
            -1.5,
            -0.75,
            0,
            0.75,
            1.5
        ];

        const colors = [
            0x77838e,
            0x89949d,
            0x66727c,
            0x9b8d7a,
            0x6d8290
        ];

        for (
            let shelf = 1;
            shelf <= 3;
            shelf++
        ) {

            positions.forEach(
                xOffset => {

                    const special =
                        specialLocationsForRack.find(
                            item =>
                                item.shelf === shelf &&
                                Math.abs(
                                    item.xOffset -
                                    xOffset
                                ) < 0.01
                        );

                    if (special) {
                        return;
                    }

                    const color =
                        colors[
                            Math.floor(
                                Math.random() *
                                colors.length
                            )
                        ];

                    createStaticBox(
                        rackId,
                        shelf,
                        xOffset,
                        color
                    );
                }
            );
        }
    }

    fillRack(
        "RACK-A",
        specialLocations["RACK-A"]
    );

    fillRack(
        "RACK-B",
        specialLocations["RACK-B"]
    );

    fillRack(
        "RACK-C",
        specialLocations["RACK-C"]
    );

    fillRack(
        "RACK-D",
        specialLocations["RACK-D"]
    );

    fillRack(
        "RACK-E",
        specialLocations["RACK-E"]
    );

    fillRack(
        "RACK-F",
        specialLocations["RACK-F"]
    );

    // ============================================================
    // 13. SPECIAL PACKAGES
    // RACK D/E/F = FRONT PICKUP
    // ============================================================

    createSpecialPackage(
        "PKG-001",
        "Electronics Box",
        "RACK-D",
        1,
        9,
        -0.75
    );

    createSpecialPackage(
        "PKG-002",
        "Clothing Box",
        "RACK-D",
        2,
        9,
        0.75
    );

    createSpecialPackage(
        "PKG-003",
        "Mobile Accessories",
        "RACK-E",
        1,
        11,
        -0.75
    );

    createSpecialPackage(
        "PKG-004",
        "Home Appliance",
        "RACK-F",
        2,
        13,
        0.75
    );

    createSpecialPackage(
        "PKG-005",
        "Kitchen Equipment",
        "RACK-A",
        2,
        1,
        -0.75
    );

    createSpecialPackage(
        "PKG-006",
        "Computer Accessories",
        "RACK-C",
        1,
        5,
        0.75
    );

    // ============================================================
    // 14. GRAPH
    // ============================================================

    const navigationNodes = [];

    const nodePositions = [

        [-11, -4],
        [-8, -4],
        [-5, -4],
        [-2, -4],
        [1, -4],
        [4, -4],
        [7, -4],
        [10, -4],

        [-11, 4],
        [-8, 4],
        [-5, 4],
        [-2, 4],
        [1, 4],
        [4, 4],
        [7, 4],
        [10, 4],

        [-11, 10],
        [-11, 6],
        [-11, 0],
        [-11, -8],
        [-11, -12],

        [-5, 10],
        [-5, 6],
        [-5, 0],
        [-5, -8],
        [-5, -12],

        [1, 10],
        [1, 6],
        [1, 0],
        [1, -8],
        [1, -12],

        [7, 10],
        [7, 6],
        [7, 0],
        [7, -8],
        [7, -12],

        [10, 10],
        [10, 6],
        [10, 4]
    ];

    nodePositions.forEach(
        (position, index) => {

            navigationNodes.push({
                id: index,
                x: position[0],
                z: position[1]
            });
        }
    );

    class Graph {

        constructor() {
            this.adjacencyList = new Map();
        }

        addNode(node) {

            if (
                !this.adjacencyList.has(node)
            ) {

                this.adjacencyList.set(
                    node,
                    []
                );
            }
        }

        addEdge(a, b) {

            this.adjacencyList
                .get(a)
                .push(b);

            this.adjacencyList
                .get(b)
                .push(a);
        }
    }

    const warehouseGraph =
        new Graph();

    for (
        let i = 0;
        i < navigationNodes.length;
        i++
    ) {

        warehouseGraph.addNode(i);
    }

    // Horizontal lower
    for (
        let i = 0;
        i < 7;
        i++
    ) {

        warehouseGraph.addEdge(
            i,
            i + 1
        );
    }

    // Horizontal upper
    for (
        let i = 8;
        i < 15;
        i++
    ) {

        warehouseGraph.addEdge(
            i,
            i + 1
        );
    }

    // Vertical
    warehouseGraph.addEdge(16, 17);
    warehouseGraph.addEdge(17, 18);
    warehouseGraph.addEdge(18, 19);
    warehouseGraph.addEdge(19, 20);

    warehouseGraph.addEdge(21, 22);
    warehouseGraph.addEdge(22, 23);
    warehouseGraph.addEdge(23, 24);
    warehouseGraph.addEdge(24, 25);

    warehouseGraph.addEdge(26, 27);
    warehouseGraph.addEdge(27, 28);
    warehouseGraph.addEdge(28, 29);
    warehouseGraph.addEdge(29, 30);

    warehouseGraph.addEdge(31, 32);
    warehouseGraph.addEdge(32, 33);
    warehouseGraph.addEdge(33, 34);
    warehouseGraph.addEdge(34, 35);

    warehouseGraph.addEdge(36, 37);
    warehouseGraph.addEdge(37, 38);

    // Connections
    warehouseGraph.addEdge(18, 8);
    warehouseGraph.addEdge(19, 0);

    warehouseGraph.addEdge(23, 10);
    warehouseGraph.addEdge(24, 2);

    warehouseGraph.addEdge(28, 12);
    warehouseGraph.addEdge(29, 4);

    warehouseGraph.addEdge(33, 14);
    warehouseGraph.addEdge(34, 6);

    warehouseGraph.addEdge(37, 15);
    warehouseGraph.addEdge(38, 7);

    // ============================================================
    // 15. GRAPH LINES
    // ============================================================

    const graphMaterial =
        new THREE.LineBasicMaterial({
            color: 0x176b45,
            transparent: true,
            opacity: 0.35
        });

    const drawnEdges = new Set();

    for (
        const [node, neighbors]
        of warehouseGraph.adjacencyList
    ) {

        for (
            const neighbor
            of neighbors
        ) {

            const edgeKey =
                [
                    node,
                    neighbor
                ]
                    .sort(
                        (a, b) =>
                            a - b
                    )
                    .join("-");

            if (
                drawnEdges.has(edgeKey)
            ) {
                continue;
            }

            drawnEdges.add(edgeKey);

            const first =
                navigationNodes[node];

            const second =
                navigationNodes[neighbor];

            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints([

                        new THREE.Vector3(
                            first.x,
                            0.15,
                            first.z
                        ),

                        new THREE.Vector3(
                            second.x,
                            0.15,
                            second.z
                        )

                    ]);

            scene.add(
                new THREE.Line(
                    geometry,
                    graphMaterial
                )
            );
        }
    }

    // ============================================================
    // 16. BFS
    // ============================================================

    function BFS(
        graph,
        start,
        target
    ) {

        const queue = [start];

        const visited =
            new Set([start]);

        const parent =
            new Map();

        parent.set(
            start,
            null
        );

        while (
            queue.length
        ) {

            const current =
                queue.shift();

            if (
                current === target
            ) {
                break;
            }

            const neighbors =
                graph.adjacencyList.get(
                    current
                ) || [];

            for (
                const neighbor
                of neighbors
            ) {

                if (
                    !visited.has(
                        neighbor
                    )
                ) {

                    visited.add(
                        neighbor
                    );

                    parent.set(
                        neighbor,
                        current
                    );

                    queue.push(
                        neighbor
                    );
                }
            }
        }

        if (
            !visited.has(target)
        ) {

            return [];
        }

        const path = [];

        let current = target;

        while (
            current !== null
        ) {

            path.unshift(current);

            current =
                parent.get(current);
        }

        return path;
    }

    // ============================================================
    // 17. LIVE BFS VISUALIZATION
    // ============================================================

    const bfsVisualNodes = [];

    const bfsDefaultMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x455a64,
            emissive: 0x000000
        });

    const bfsVisitedMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x00e676,
            emissive: 0x004d28,
            emissiveIntensity: 1.5
        });

    const bfsCurrentMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffca28,
            emissive: 0x8a6500,
            emissiveIntensity: 2
        });

    const bfsPathMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x2196f3,
            emissive: 0x064a9e,
            emissiveIntensity: 2
        });

    navigationNodes.forEach(
        node => {

            const sphere =
                new THREE.Mesh(
                    new THREE.SphereGeometry(
                        0.22,
                        16,
                        16
                    ),
                    bfsDefaultMaterial.clone()
                );

            sphere.position.set(
                node.x,
                0.30,
                node.z
            );

            sphere.visible = false;

            scene.add(sphere);

            bfsVisualNodes.push(sphere);
        }
    );

    let bfsVisitedOrder = [];

    let bfsAnimationIndex = 0;

    let bfsAnimationTimer = null;

    let bfsAnimationRunning = false;

    let bfsCurrentStart = null;

    let bfsCurrentTarget = null;

    function resetBFSVisualization() {

        bfsVisualNodes.forEach(
            node => {

                node.visible = true;

                node.material =
                    bfsDefaultMaterial.clone();

                node.scale.set(
                    1,
                    1,
                    1
                );
            }
        );

        bfsVisitedOrder = [];
        bfsAnimationIndex = 0;
        bfsAnimationRunning = false;

        if (
            bfsAnimationTimer
        ) {

            clearTimeout(
                bfsAnimationTimer
            );

            bfsAnimationTimer = null;
        }
    }

    function calculateBFSVisualization(
        graph,
        start,
        target
    ) {

        const queue = [start];

        const visited =
            new Set([start]);

        const parent =
            new Map();

        parent.set(
            start,
            null
        );

        const traversalOrder = [];

        while (
            queue.length > 0
        ) {

            const current =
                queue.shift();

            traversalOrder.push({
                node: current,
                queue: [...queue]
            });

            if (
                current === target
            ) {

                break;
            }

            const neighbors =
                graph.adjacencyList.get(
                    current
                ) || [];

            for (
                const neighbor
                of neighbors
            ) {

                if (
                    !visited.has(
                        neighbor
                    )
                ) {

                    visited.add(
                        neighbor
                    );

                    parent.set(
                        neighbor,
                        current
                    );

                    queue.push(
                        neighbor
                    );
                }
            }
        }

        return {
            traversalOrder,
            parent,
            visited
        };
    }

    function startBFSVisualization(
        start,
        target
    ) {

        resetBFSVisualization();

        bfsCurrentStart = start;
        bfsCurrentTarget = target;

        const result =
            calculateBFSVisualization(
                warehouseGraph,
                start,
                target
            );

        bfsVisitedOrder =
            result.traversalOrder;

        bfsAnimationIndex = 0;

        bfsAnimationRunning = true;

        if (
            typeof algorithmValue !==
            "undefined"
        ) {

            algorithmValue.textContent =
                "BFS SEARCH";
        }

        animateNextBFSNode();
    }

    function animateNextBFSNode() {

        if (
            bfsAnimationIndex >=
            bfsVisitedOrder.length
        ) {

            bfsAnimationRunning = false;

            showFinalBFSPath(
                bfsCurrentStart,
                bfsCurrentTarget
            );

            return;
        }

        const step =
            bfsVisitedOrder[
                bfsAnimationIndex
            ];

        const nodeId =
            step.node;

        const visualNode =
            bfsVisualNodes[nodeId];

        if (
            visualNode
        ) {

            visualNode.visible = true;

            visualNode.material =
                bfsCurrentMaterial.clone();

            visualNode.scale.set(
                1.5,
                1.5,
                1.5
            );
        }

        dsaCurrentNode.textContent =
            nodeId;

        dsaDestination.textContent =
            bfsCurrentTarget;

        dsaBFSQueue.textContent =
            step.queue.length
                ? "[" +
                step.queue.join(", ") +
                "]"
                : "[]";

        dsaBFSVisited.textContent =
            bfsVisitedOrder
                .slice(
                    0,
                    bfsAnimationIndex + 1
                )
                .map(
                    item => item.node
                )
                .join(" → ");

        dsaBFSStatus.textContent =
            "🔎 Searching...";

        bfsAnimationIndex++;

        bfsAnimationTimer =
            setTimeout(
                () => {

                    if (
                        visualNode
                    ) {

                        visualNode.material =
                            bfsVisitedMaterial.clone();

                        visualNode.scale.set(
                            1,
                            1,
                            1
                        );
                    }

                    animateNextBFSNode();

                },
                180
            );
    }

    function showFinalBFSPath(
        start,
        target
    ) {

        const finalPath =
            BFS(
                warehouseGraph,
                start,
                target
            );

        finalPath.forEach(
            nodeId => {

                const node =
                    bfsVisualNodes[
                        nodeId
                    ];

                if (
                    node
                ) {

                    node.visible = true;

                    node.material =
                        bfsPathMaterial.clone();

                    node.scale.set(
                        1.35,
                        1.35,
                        1.35
                    );
                }
            }
        );

        if (
            finalPath.length
        ) {

            bfsVisualNodes[
                finalPath[0]
            ].material =
                bfsCurrentMaterial.clone();

            bfsVisualNodes[
                finalPath[
                    finalPath.length - 1
                ]
            ].material =
                bfsCurrentMaterial.clone();
        }

        dsaPath.textContent =
            finalPath.join(
                " → "
            );

        dsaPathLength.textContent =
            Math.max(
                finalPath.length - 1,
                0
            );

        dsaBFSStatus.textContent =
            "✅ Shortest path found";
    }

    // ============================================================
    // 18. PICKUP MARKERS
    // ============================================================

    const pickupMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffff00,
            emissive: 0x997700,
            emissiveIntensity: 1
        });

    function createPickupPoint(
        nodeId
    ) {

        const node =
            navigationNodes[nodeId];

        const marker =
            new THREE.Mesh(
                new THREE.RingGeometry(
                    0.45,
                    0.68,
                    32
                ),
                pickupMaterial
            );

        marker.rotation.x =
            -Math.PI / 2;

        marker.position.set(
            node.x,
            0.08,
            node.z
        );

        scene.add(marker);
    }

    createPickupPoint(1);
    createPickupPoint(5);
    createPickupPoint(9);
    createPickupPoint(11);
    createPickupPoint(13);

    // ============================================================
    // 19. DELIVERY AREA
    // ============================================================

    const deliveryArea =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5,
                0.15,
                4
            ),
            new THREE.MeshStandardMaterial({
                color: 0x0758a8,
                emissive: 0x031b35,
                emissiveIntensity: 0.7
            })
        );

    deliveryArea.position.set(
        10,
        0.08,
        10
    );

    scene.add(deliveryArea);

    const deliveryBorder =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                5.4,
                0.18,
                4.4
            ),
            new THREE.MeshStandardMaterial({
                color: 0x00ff88,
                emissive: 0x003322
            })
        );

    deliveryBorder.position.set(
        10,
        0.04,
        10
    );

    scene.add(deliveryBorder);

    createLabel(
        "DELIVERY AREA",
        10,
        2.8,
        10,
        2.7
    );

    // ============================================================
    // 20. DELIVERY SLOTS
    // ============================================================

    const deliverySlots = [];

    const deliveryPositions = [
        [-1.4, -1.0],
        [0, -1.0],
        [1.4, -1.0],
        [-1.4, 0.2],
        [0, 0.2],
        [1.4, 0.2],
        [-0.7, 1.1],
        [0.7, 1.1]
    ];

    deliveryPositions.forEach(
        position => {

            deliverySlots.push(
                new THREE.Vector3(
                    10 + position[0],
                    0.48,
                    10 + position[1]
                )
            );
        }
    );

    // ============================================================
    // 21. ROBOT
    // ============================================================

    const robot =
        new THREE.Group();

    const robotBase =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.5,
                0.35,
                1.5
            ),
            new THREE.MeshStandardMaterial({
                color: 0x1976d2,
                metalness: 0.6,
                roughness: 0.3
            })
        );

    robotBase.position.y = 0.35;
    robotBase.castShadow = true;

    robot.add(robotBase);

    const robotBody =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.15,
                0.85,
                1.15
            ),
            new THREE.MeshStandardMaterial({
                color: 0x2196f3,
                metalness: 0.5,
                roughness: 0.3
            })
        );

    robotBody.position.y = 0.9;
    robotBody.castShadow = true;

    robot.add(robotBody);

    const sensor =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                0.55,
                0.22,
                0.55
            ),
            new THREE.MeshStandardMaterial({
                color: 0x111111,
                metalness: 0.8
            })
        );

    sensor.position.y = 1.45;

    robot.add(sensor);

    const sensorLight =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.12,
                16,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0x00ffcc,
                emissive: 0x00ffcc,
                emissiveIntensity: 3
            })
        );

    sensorLight.position.set(
        0,
        1.65,
        0
    );

    robot.add(sensorLight);

    // ============================================================
    // 22. ROBOT WHEELS
    // ============================================================

    const wheelMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x111111,
            roughness: 0.8
        });

    const wheelGeometry =
        new THREE.CylinderGeometry(
            0.3,
            0.3,
            0.22,
            24
        );

    const wheelPositions = [
        [-0.75, 0.32, -0.55],
        [0.75, 0.32, -0.55],
        [-0.75, 0.32, 0.55],
        [0.75, 0.32, 0.55]
    ];

    wheelPositions.forEach(
        position => {

            const wheel =
                new THREE.Mesh(
                    wheelGeometry,
                    wheelMaterial
                );

            wheel.rotation.z =
                Math.PI / 2;

            wheel.position.set(
                position[0],
                position[1],
                position[2]
            );

            wheel.castShadow = true;

            robot.add(wheel);
        }
    );

    const robotStartNode = 37;

    robot.position.set(
        navigationNodes[
            robotStartNode
        ].x,
        0,
        navigationNodes[
            robotStartNode
        ].z
    );

    scene.add(robot);

    // ============================================================
    // 23. PRIORITY QUEUE
    // ============================================================

    class PriorityQueue {

        constructor() {
            this.items = [];
        }

        enqueue(
            item,
            priority
        ) {

            this.items.push({
                item,
                priority
            });

            this.items.sort(
                (a, b) =>
                    a.priority -
                    b.priority
            );
        }

        dequeue() {

            if (
                this.items.length === 0
            ) {
                return null;
            }

            return this.items.shift().item;
        }

        clear() {
            this.items = [];
        }

        size() {
            return this.items.length;
        }
    }

    const taskQueue =
        new PriorityQueue();

    // ============================================================
    // 24. ROBOT VARIABLES
    // ============================================================

    let robotState = "READY";

    let currentPath = [];

    let currentPathIndex = 0;

    let currentNode =
        robotStartNode;

    let activePackage = null;

    let carriedPackages = [];

    let pickupAnimationProgress = 0;

    let deliveryAnimationProgress = 0;

    let deliveryCount = 0;

    const deliveredPackages = [];

    // ============================================================
    // 25. ROUTE DRAWING
    // ============================================================

    let routeLines = [];

    function clearRoute() {

        routeLines.forEach(
            line => {

                scene.remove(line);

                line.geometry.dispose();

                line.material.dispose();
            }
        );

        routeLines = [];
    }

    function drawRoute(
        path,
        color = 0xffff00
    ) {

        clearRoute();

        if (
            path.length < 2
        ) {
            return;
        }

        const material =
            new THREE.LineBasicMaterial({
                color
            });

        for (
            let i = 0;
            i < path.length - 1;
            i++
        ) {

            const first =
                navigationNodes[
                    path[i]
                ];

            const second =
                navigationNodes[
                    path[i + 1]
                ];

            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints([

                        new THREE.Vector3(
                            first.x,
                            0.24,
                            first.z
                        ),

                        new THREE.Vector3(
                            second.x,
                            0.24,
                            second.z
                        )

                    ]);

            const line =
                new THREE.Line(
                    geometry,
                    material
                );

            scene.add(line);

            routeLines.push(line);
        }
    }

    // ============================================================
    // 26. MAIN DSA DASHBOARD
    // ============================================================

    const dsaPanel =
        document.createElement("div");

    dsaPanel.style.position = "fixed";
    dsaPanel.style.top = "18px";
    dsaPanel.style.right = "18px";
    dsaPanel.style.width = "340px";
    dsaPanel.style.maxHeight =
        "calc(100vh - 36px)";
    dsaPanel.style.overflowY = "auto";
    dsaPanel.style.padding = "16px";
    dsaPanel.style.boxSizing = "border-box";
    dsaPanel.style.background =
        "rgba(5,10,18,0.96)";
    dsaPanel.style.border =
        "2px solid #2196f3";
    dsaPanel.style.borderRadius = "14px";
    dsaPanel.style.color = "white";
    dsaPanel.style.fontFamily =
        "Arial, sans-serif";
    dsaPanel.style.zIndex = "999999";
    dsaPanel.style.boxShadow =
        "0 0 25px rgba(33,150,243,0.25)";

    document.body.appendChild(dsaPanel);

    // ============================================================
    // 27. DSA TITLE
    // ============================================================

    const dsaTitle =
        document.createElement("div");

    dsaTitle.innerHTML =
        "🧠 DSA ALGORITHM<br>DASHBOARD";

    dsaTitle.style.fontSize = "20px";
    dsaTitle.style.fontWeight = "bold";
    dsaTitle.style.color = "#42a5f5";
    dsaTitle.style.marginBottom = "14px";

    dsaPanel.appendChild(dsaTitle);

    // ============================================================
    // 28. CURRENT ALGORITHM
    // ============================================================

    const algorithmBox =
        document.createElement("div");

    algorithmBox.style.background =
        "rgba(33,150,243,0.10)";
    algorithmBox.style.border =
        "1px solid #23628c";
    algorithmBox.style.borderRadius = "8px";
    algorithmBox.style.padding = "10px";
    algorithmBox.style.marginBottom = "10px";

    dsaPanel.appendChild(
        algorithmBox
    );

    algorithmBox.innerHTML =
        `
            <div style="
                color:#90caf9;
                font-size:11px;
                font-weight:bold;
            ">
                ⚙️ CURRENT ALGORITHM
            </div>

            <div
                id="algorithmValue"
                style="
                    font-size:18px;
                    font-weight:bold;
                    margin-top:5px;
                "
            >
                GRAPH
            </div>
        `;

    const algorithmValue =
        document.getElementById(
            "algorithmValue"
        );

    // ============================================================
    // 29. GRAPH INFORMATION
    // ============================================================

    const graphBox =
        document.createElement("div");

    graphBox.style.background =
        "rgba(255,255,255,0.04)";
    graphBox.style.border =
        "1px solid #344452";
    graphBox.style.borderRadius = "8px";
    graphBox.style.padding = "10px";
    graphBox.style.marginBottom = "10px";

    dsaPanel.appendChild(
        graphBox
    );

    graphBox.innerHTML =
        `
            <div style="
                color:#90caf9;
                font-size:11px;
                font-weight:bold;
                margin-bottom:7px;
            ">
                🔵 GRAPH NAVIGATION
            </div>

            <div>
                Current Node:
                <b id="dsaCurrentNode">
                    37
                </b>
            </div>

            <div>
                Destination:
                <b id="dsaDestination">
                    --
                </b>
            </div>

            <div>
                Path Length:
                <b id="dsaPathLength">
                    0
                </b>
            </div>

            <div style="
                margin-top:7px;
                color:#9fb0bf;
                font-size:11px;
            ">
                Final BFS Path
            </div>

            <div
                id="dsaPath"
                style="
                    margin-top:5px;
                    color:#00ff88;
                    font-size:11px;
                    line-height:1.6;
                    word-break:break-word;
                "
            >
                No active route
            </div>
        `;

    const dsaCurrentNode =
        document.getElementById(
            "dsaCurrentNode"
        );

    const dsaDestination =
        document.getElementById(
            "dsaDestination"
        );

    const dsaPathLength =
        document.getElementById(
            "dsaPathLength"
        );

    const dsaPath =
        document.getElementById(
            "dsaPath"
        );

    // ============================================================
    // 30. LIVE BFS PANEL
    // ============================================================

    const bfsBox =
        document.createElement("div");

    bfsBox.style.background =
        "rgba(33,150,243,0.06)";
    bfsBox.style.border =
        "1px solid #25648d";
    bfsBox.style.borderRadius = "8px";
    bfsBox.style.padding = "10px";
    bfsBox.style.marginBottom = "10px";

    dsaPanel.appendChild(
        bfsBox
    );

    bfsBox.innerHTML =
        `
            <div style="
                color:#42a5f5;
                font-size:11px;
                font-weight:bold;
                margin-bottom:8px;
            ">
                🔎 LIVE BFS VISUALIZATION
            </div>

            <div>
                Status:
                <b
                    id="dsaBFSStatus"
                    style="color:#ffca28;"
                >
                    Waiting
                </b>
            </div>

            <div style="
                margin-top:8px;
            ">
                BFS Queue:
            </div>

            <div
                id="dsaBFSQueue"
                style="
                    margin-top:4px;
                    padding:6px;
                    background:#101923;
                    border-radius:5px;
                    color:#ffca28;
                    font-family:monospace;
                "
            >
                []
            </div>

            <div style="
                margin-top:8px;
            ">
                Visited Nodes:
            </div>

            <div
                id="dsaBFSVisited"
                style="
                    margin-top:4px;
                    color:#00e676;
                    font-size:11px;
                    line-height:1.5;
                    word-break:break-word;
                "
            >
                None
            </div>
        `;

    const dsaBFSStatus =
        document.getElementById(
            "dsaBFSStatus"
        );

    const dsaBFSQueue =
        document.getElementById(
            "dsaBFSQueue"
        );

    const dsaBFSVisited =
        document.getElementById(
            "dsaBFSVisited"
        );

    // ============================================================
    // 31. PRIORITY QUEUE PANEL
    // ============================================================

    const queueBox =
        document.createElement("div");

    queueBox.style.background =
        "rgba(255,255,255,0.04)";
    queueBox.style.border =
        "1px solid #344452";
    queueBox.style.borderRadius = "8px";
    queueBox.style.padding = "10px";
    queueBox.style.marginBottom = "10px";

    dsaPanel.appendChild(
        queueBox
    );

    queueBox.innerHTML =
        `
            <div style="
                color:#ffca28;
                font-size:11px;
                font-weight:bold;
                margin-bottom:7px;
            ">
                🚨 PRIORITY QUEUE
            </div>

            <div
                id="dsaQueue"
                style="
                    font-size:12px;
                    line-height:1.7;
                "
            >
                Queue Empty
            </div>
        `;

    const dsaQueue =
        document.getElementById(
            "dsaQueue"
        );

    // ============================================================
    // 32. HASH TABLE PANEL
    // ============================================================

    const hashBox =
        document.createElement("div");

    hashBox.style.background =
        "rgba(255,255,255,0.04)";
    hashBox.style.border =
        "1px solid #344452";
    hashBox.style.borderRadius = "8px";
    hashBox.style.padding = "10px";
    hashBox.style.marginBottom = "10px";

    dsaPanel.appendChild(
        hashBox
    );

    hashBox.innerHTML =
        `
            <div style="
                color:#ab47bc;
                font-size:11px;
                font-weight:bold;
                margin-bottom:7px;
            ">
                🔑 PACKAGE HASH TABLE
            </div>

            <div
                id="dsaHashTable"
                style="
                    font-size:11px;
                    line-height:1.7;
                "
            >
            </div>
        `;

    const dsaHashTable =
        document.getElementById(
            "dsaHashTable"
        );

    // ============================================================
    // 33. ROBOT STATUS
    // ============================================================

    const robotBox =
        document.createElement("div");

    robotBox.style.background =
        "rgba(255,255,255,0.04)";
    robotBox.style.border =
        "1px solid #344452";
    robotBox.style.borderRadius = "8px";
    robotBox.style.padding = "10px";
    robotBox.style.marginBottom = "10px";

    dsaPanel.appendChild(
        robotBox
    );

    robotBox.innerHTML =
        `
            <div style="
                color:#00e676;
                font-size:11px;
                font-weight:bold;
                margin-bottom:7px;
            ">
                🤖 ROBOT STATUS
            </div>

            <div>
                State:
                <b id="dsaRobotState">
                    READY
                </b>
            </div>

            <div>
                Carrying:
                <b id="dsaCarrying">
                    0
                </b>
            </div>

            <div>
                Delivered:
                <b id="dsaDelivered">
                    0
                </b>
            </div>
        `;

    const dsaRobotState =
        document.getElementById(
            "dsaRobotState"
        );

    const dsaCarrying =
        document.getElementById(
            "dsaCarrying"
        );

    const dsaDelivered =
        document.getElementById(
            "dsaDelivered"
        );

    // ============================================================
    // 34. DSA EXPLANATION
    // ============================================================

    const explanation =
        document.createElement("div");

    explanation.style.padding = "9px";
    explanation.style.background =
        "rgba(0,230,118,0.06)";
    explanation.style.borderRadius = "7px";
    explanation.style.fontSize = "11px";
    explanation.style.lineHeight = "1.6";
    explanation.style.color = "#aebbc7";

    explanation.innerHTML =
        `
            <b style="color:#00e676">
                How DSA is used
            </b>

            <br><br>

            <b>Graph:</b>
            Warehouse pathways.

            <br>

            <b>BFS:</b>
            Shortest route.

            <br>

            <b>Priority Queue:</b>
            Package order.

            <br>

            <b>Hash Table:</b>
            Package lookup.
        `;

    dsaPanel.appendChild(
        explanation
    );

    // ============================================================
    // 35. UPDATE DSA DASHBOARD
    // ============================================================

    function updateDSADashboard() {

        dsaCurrentNode.textContent =
            currentNode;

        dsaRobotState.textContent =
            robotState;

        dsaCarrying.textContent =
            carriedPackages.length;

        dsaDelivered.textContent =
            deliveredPackages.length;

        if (
            taskQueue.items.length === 0
        ) {

            dsaQueue.innerHTML =
                `
                    <span style="
                        color:#77838e;
                    ">
                        Queue Empty
                    </span>
                `;

        } else {

            dsaQueue.innerHTML =
                taskQueue.items
                    .map(
                        (entry, index) => {

                            const task =
                                entry.item;

                            const priority =
                                entry.priority;

                            const priorityText =
                                priority === 1
                                    ? "HIGH"
                                    : priority === 2
                                        ? "NORMAL"
                                        : "LOW";

                            const priorityColor =
                                priority === 1
                                    ? "#ff5252"
                                    : priority === 2
                                        ? "#ffca28"
                                        : "#90a4ae";

                            return `
                                <div style="
                                    padding:4px 0;
                                    border-bottom:
                                    1px solid #28333d;
                                ">
                                    <b>
                                        ${index + 1}.
                                        ${task.packageId}
                                    </b>

                                    <span style="
                                        float:right;
                                        color:${priorityColor};
                                    ">
                                        ${priorityText}
                                    </span>
                                </div>
                            `;
                        }
                    )
                    .join("");
        }

        dsaHashTable.innerHTML =
            packageTable
                .getAllPackages()
                .map(
                    pkg => {

                        const color =
                            pkg.status ===
                            "DELIVERED"
                                ? "#00e676"
                                : pkg.status ===
                                "ON_ROBOT"
                                    ? "#ffca28"
                                    : "#90caf9";

                        return `
                            <div style="
                                padding:3px 0;
                                border-bottom:
                                1px solid #28333d;
                            ">
                                <b>
                                    ${pkg.id}
                                </b>

                                →
                                ${pkg.rack}

                                <span style="
                                    float:right;
                                    color:${color};
                                    font-size:10px;
                                ">
                                    ${pkg.status}
                                </span>
                            </div>
                        `;
                    }
                )
                .join("");
    }

    // ============================================================
    // 36. ROBOT MOVEMENT
    // ============================================================

    function moveRobotAlongPath() {

        if (
            currentPath.length === 0
        ) {
            return;
        }

        if (
            currentPathIndex >=
            currentPath.length
        ) {

            handlePathFinished();

            return;
        }

        const targetNode =
            navigationNodes[
                currentPath[
                    currentPathIndex
                ]
            ];

        const target =
            new THREE.Vector3(
                targetNode.x,
                0,
                targetNode.z
            );

        const direction =
            target.clone()
                .sub(
                    robot.position
                );

        const distance =
            direction.length();

        if (
            distance < 0.08
        ) {

            robot.position.copy(
                target
            );

            currentNode =
                currentPath[
                    currentPathIndex
                ];

            currentPathIndex++;

            return;
        }

        direction.normalize();

        robot.position.add(
            direction.multiplyScalar(
                0.075
            )
        );

        const angle =
            Math.atan2(
                direction.x,
                direction.z
            );

        robot.rotation.y =
            angle;
    }

    // ============================================================
    // 37. PATH FINISHED
    // ============================================================

    function handlePathFinished() {

        currentPath = [];
        currentPathIndex = 0;

        if (
            robotState ===
            "GOING_TO_PICKUP" ||
            robotState ===
            "GOING_TO_NEXT_PICKUP"
        ) {

            robotState =
                "PICKING_UP";

            pickupAnimationProgress =
                0;

            updateStatus(
                "📦 Picking up " +
                activePackage.id +
                "..."
            );

            return;
        }

        if (
            robotState ===
            "GOING_TO_DELIVERY"
        ) {

            robotState =
                "DELIVERING";

            deliveryAnimationProgress =
                0;

            clearRoute();

            updateStatus(
                "🚚 Delivering all packages..."
            );
        }
    }

    // ============================================================
    // 38. ROBOT PACKAGE POSITION
    // ============================================================

    function getRobotCarryPosition(
        index
    ) {

        const positions = [

            [-0.38, 1.55, 0],

            [0.38, 1.55, 0],

            [0, 2.15, 0],

            [-0.38, 2.2, 0],

            [0.38, 2.2, 0],

            [0, 2.7, 0]

        ];

        const p =
            positions[
                index %
                positions.length
            ];

        return new THREE.Vector3(
            p[0],
            p[1],
            p[2]
        );
    }

    // ============================================================
    // 39. PICKUP ANIMATION
    // ============================================================

    function animatePackagePickup() {

        if (
            !activePackage
        ) {
            return;
        }

        const mesh =
            packageMeshes[
                activePackage.id
            ];

        if (!mesh) {

            attachPackageToRobot();

            return;
        }

        pickupAnimationProgress +=
            0.035;

        const progress =
            Math.min(
                pickupAnimationProgress,
                1
            );

        const worldTarget =
            robot.localToWorld(
                new THREE.Vector3(
                    0,
                    1.55,
                    0
                )
            );

        const start =
            new THREE.Vector3(
                activePackage.position.x,
                activePackage.position.y,
                activePackage.position.z
            );

        mesh.position.lerpVectors(
            start,
            worldTarget,
            progress
        );

        mesh.position.y +=
            Math.sin(
                progress * Math.PI
            ) * 0.5;

        if (
            progress >= 1
        ) {

            attachPackageToRobot();
        }
    }

    // ============================================================
    // 40. ATTACH PACKAGE
    // ============================================================

    function attachPackageToRobot() {

        if (
            !activePackage
        ) {
            return;
        }

        const packageMesh =
            packageMeshes[
                activePackage.id
            ];

        if (
            !packageMesh
        ) {
            return;
        }

        scene.remove(
            packageMesh
        );

        robot.add(
            packageMesh
        );

        packageMesh.position.copy(
            getRobotCarryPosition(
                carriedPackages.length
            )
        );

        packageMesh.rotation.set(
            0,
            0,
            0
        );

        carriedPackages.push({
            id:
                activePackage.id,

            package:
                activePackage,

            mesh:
                packageMesh
        });

        activePackage.status =
            "ON_ROBOT";

        if (
            packageLabels[
                activePackage.id
            ]
        ) {

            packageLabels[
                activePackage.id
            ].visible = false;
        }

        const nextTask =
            taskQueue.dequeue();

        if (
            nextTask
        ) {

            activePackage =
                packageTable.getPackage(
                    nextTask.packageId
                );

            startBFSVisualization(
                currentNode,
                activePackage.pickupNode
            );

            const nextPath =
                BFS(
                    warehouseGraph,
                    currentNode,
                    activePackage.pickupNode
                );

            currentPath =
                nextPath;

            currentPathIndex = 0;

            robotState =
                "GOING_TO_NEXT_PICKUP";

            drawRoute(
                currentPath,
                0xffd600
            );

            updateStatus(
                "🤖 Going to " +
                activePackage.id
            );

            return;
        }

        activePackage = null;

        startBFSVisualization(
            currentNode,
            36
        );

        const deliveryPath =
            BFS(
                warehouseGraph,
                currentNode,
                36
            );

        currentPath =
            deliveryPath;

        currentPathIndex = 0;

        robotState =
            "GOING_TO_DELIVERY";

        drawRoute(
            currentPath,
            0xff8800
        );

        updateStatus(
            "📦 All packages collected"
        );
    }

    // ============================================================
    // 41. DELIVERY ANIMATION
    // ============================================================

    function animateAllDelivery() {

        if (
            carriedPackages.length === 0
        ) {

            finishBatchDelivery();

            return;
        }

        deliveryAnimationProgress +=
            0.025;

        const progress =
            Math.min(
                deliveryAnimationProgress,
                1
            );

        carriedPackages.forEach(
            (item, index) => {

                const start =
                    getRobotCarryPosition(
                        index
                    );

                const target =
                    deliverySlots[
                        (
                            deliveryCount +
                            index
                        ) %
                        deliverySlots.length
                    ];

                const targetLocal =
                    robot.worldToLocal(
                        target.clone()
                    );

                item.mesh.position.lerpVectors(
                    start,
                    targetLocal,
                    progress
                );

                item.mesh.position.y +=
                    Math.sin(
                        progress * Math.PI
                    ) * 0.35;
            }
        );

        if (
            progress >= 1
        ) {

            finishBatchDelivery();
        }
    }

    // ============================================================
    // 42. FINISH DELIVERY
    // ============================================================

    function finishBatchDelivery() {

        const delivered =
            [...carriedPackages];

        delivered.forEach(
            (item, index) => {

                const mesh =
                    item.mesh;

                robot.remove(mesh);

                const slotIndex =
                    (
                        deliveryCount +
                        index
                    ) %
                    deliverySlots.length;

                const target =
                    deliverySlots[
                        slotIndex
                    ];

                mesh.position.copy(
                    target
                );

                scene.add(mesh);

                item.package.status =
                    "DELIVERED";

                if (
                    !deliveredPackages.includes(
                        item.id
                    )
                ) {

                    deliveredPackages.push(
                        item.id
                    );
                }

                addDeliveryLabel(
                    item.id,
                    target
                );
            }
        );

        deliveryCount +=
            delivered.length;

        carriedPackages = [];

        activePackage = null;

        taskQueue.clear();

        robotState = "READY";

        currentPath = [];

        currentPathIndex = 0;

        clearRoute();

        updatePackageCheckboxes();

        dsaBFSStatus.textContent =
            "✅ Delivery completed";

        updateStatus(
            "✅ " +
            delivered.length +
            " package" +
            (
                delivered.length > 1
                    ? "s"
                    : ""
            ) +
            " delivered!"
        );
    }

    // ============================================================
    // 43. DELIVERY LABEL
    // ============================================================

    function addDeliveryLabel(
        id,
        position
    ) {

        const canvas =
            document.createElement(
                "canvas"
            );

        canvas.width = 256;
        canvas.height = 80;

        const ctx =
            canvas.getContext("2d");

        ctx.fillStyle =
            "rgba(0,0,0,0.8)";

        ctx.fillRect(
            0,
            0,
            256,
            80
        );

        ctx.fillStyle =
            "#00ff88";

        ctx.font =
            "bold 28px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            id,
            128,
            48
        );

        const texture =
            new THREE.CanvasTexture(
                canvas
            );

        const material =
            new THREE.SpriteMaterial({
                map: texture,
                transparent: true
            });

        const sprite =
            new THREE.Sprite(
                material
            );

        sprite.position.set(
            position.x,
            1.05,
            position.z
        );

        sprite.scale.set(
            1.2,
            0.4,
            1
        );

        scene.add(sprite);
    }

    // ============================================================
    // 44. LEFT CONTROL PANEL
    // ============================================================

    const panel =
        document.createElement("div");

    panel.style.position = "fixed";
    panel.style.top = "18px";
    panel.style.left = "18px";
    panel.style.width = "350px";
    panel.style.maxHeight =
        "calc(100vh - 36px)";
    panel.style.overflowY = "auto";
    panel.style.padding = "18px";
    panel.style.boxSizing = "border-box";
    panel.style.background =
        "rgba(5,10,18,0.96)";
    panel.style.border =
        "2px solid #00e676";
    panel.style.borderRadius = "14px";
    panel.style.color = "white";
    panel.style.fontFamily =
        "Arial, sans-serif";
    panel.style.zIndex = "999999";
    panel.style.boxShadow =
        "0 0 25px rgba(0,255,120,0.25)";

    document.body.appendChild(panel);

    // ============================================================
    // 45. TITLE
    // ============================================================

    const title =
        document.createElement("div");

    title.innerHTML =
        "🤖 AUTONOMOUS<br>WAREHOUSE ROBOT";

    title.style.fontSize = "21px";
    title.style.fontWeight = "bold";
    title.style.lineHeight = "1.25";
    title.style.color = "#00ff88";
    title.style.marginBottom = "15px";

    panel.appendChild(title);

    const description =
        document.createElement("div");

    description.innerHTML =
        `
            <div style="
                color:#9fb0bf;
                font-size:12px;
                line-height:1.5;
                margin-bottom:15px;
            ">
                Select multiple packages.
                The robot collects them together
                and delivers them to the Delivery Area.
            </div>
        `;

    panel.appendChild(description);

    // ============================================================
    // 46. SELECT ALL
    // ============================================================

    const selectAllRow =
        document.createElement("div");

    const selectAllLabel =
        document.createElement("label");

    selectAllLabel.innerHTML =
        `
            <input
                type="checkbox"
                id="selectAllPackages"
                style="transform:scale(1.2)"
            >

            <span style="
                margin-left:7px;
                font-weight:bold;
            ">
                Select All Available
            </span>
        `;

    selectAllRow.appendChild(
        selectAllLabel
    );

    panel.appendChild(
        selectAllRow
    );

    // ============================================================
    // 47. PACKAGE LIST
    // ============================================================

    const packageList =
        document.createElement("div");

    packageList.style.display =
        "flex";

    packageList.style.flexDirection =
        "column";

    packageList.style.gap = "8px";
    packageList.style.marginTop = "10px";

    panel.appendChild(
        packageList
    );

    function createPackageCheckbox(
        pkg
    ) {

        const row =
            document.createElement("div");

        row.style.padding = "10px";
        row.style.border =
            "1px solid #344452";
        row.style.borderRadius = "9px";
        row.style.background =
            "rgba(255,255,255,0.04)";

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.className =
            "package-check";
        checkbox.dataset.id =
            pkg.id;

        checkbox.style.transform =
            "scale(1.2)";

        const name =
            document.createElement("span");

        name.style.marginLeft = "8px";

        name.innerHTML =
            `
                <b>${pkg.id}</b>

                <br>

                <span style="
                    font-size:12px;
                    color:#b7c2cc;
                ">
                    ${pkg.name}
                </span>
            `;

        const topRow =
            document.createElement("div");

        topRow.appendChild(
            checkbox
        );

        topRow.appendChild(
            name
        );

        row.appendChild(
            topRow
        );

        const details =
            document.createElement("div");

        details.style.fontSize = "11px";
        details.style.color = "#82909c";
        details.style.marginTop = "7px";

        details.textContent =
            `Rack: ${pkg.rack} | Shelf: ${pkg.shelf}`;

        row.appendChild(details);

        const priority =
            document.createElement("select");

        priority.className =
            "priority-input";

        priority.dataset.id =
            pkg.id;

        priority.style.marginTop =
            "7px";

        priority.style.background =
            "#17222d";

        priority.style.color =
            "white";

        priority.style.border =
            "1px solid #40505f";

        priority.style.borderRadius =
            "5px";

        for (
            let i = 1;
            i <= 3;
            i++
        ) {

            const option =
                document.createElement(
                    "option"
                );

            option.value = i;

            option.textContent =
                i === 1
                    ? "High"
                    : i === 2
                        ? "Normal"
                        : "Low";

            priority.appendChild(
                option
            );
        }

        row.appendChild(priority);

        packageList.appendChild(row);
    }

    packageTable
        .getAllPackages()
        .forEach(
            pkg => {

                createPackageCheckbox(
                    pkg
                );
            }
        );

    // ============================================================
    // 48. SELECT ALL EVENT
    // ============================================================

    const selectAllCheckbox =
        document.getElementById(
            "selectAllPackages"
        );

    selectAllCheckbox.addEventListener(
        "change",
        () => {

            document
                .querySelectorAll(
                    ".package-check"
                )
                .forEach(
                    checkbox => {

                        const pkg =
                            packageTable.getPackage(
                                checkbox.dataset.id
                            );

                        if (
                            pkg &&
                            pkg.status ===
                            "ON_RACK"
                        ) {

                            checkbox.checked =
                                selectAllCheckbox.checked;
                        }
                    }
                );
        }
    );

    // ============================================================
    // 49. SEND BUTTON
    // ============================================================

    const sendButton =
        document.createElement("button");

    sendButton.textContent =
        "🚀 COLLECT & DELIVER ALL";

    sendButton.style.width = "100%";
    sendButton.style.padding = "13px";
    sendButton.style.marginTop = "14px";
    sendButton.style.border = "none";
    sendButton.style.borderRadius = "8px";
    sendButton.style.background = "#00c853";
    sendButton.style.color = "white";
    sendButton.style.fontWeight = "bold";
    sendButton.style.fontSize = "14px";
    sendButton.style.cursor = "pointer";

    panel.appendChild(
        sendButton
    );

    // ============================================================
    // 50. STATUS
    // ============================================================

    const statusElement =
        document.createElement("div");

    statusElement.style.marginTop = "16px";
    statusElement.style.padding = "10px";
    statusElement.style.background =
        "rgba(0,255,100,0.08)";
    statusElement.style.borderRadius = "7px";
    statusElement.style.color = "#00ff88";
    statusElement.style.fontWeight = "bold";

    statusElement.textContent =
        "🟢 Robot Ready";

    panel.appendChild(
        statusElement
    );

    // ============================================================
    // 51. INFO
    // ============================================================

    const packageInfo =
        document.createElement("div");

    packageInfo.style.marginTop = "14px";
    packageInfo.style.lineHeight = "1.6";
    packageInfo.style.fontSize = "13px";

    packageInfo.innerHTML =
        `
            <div>
                <b>Warehouse:</b>
                6 Racks
            </div>

            <div>
                <b>Rack Capacity:</b>
                3 Shelves
            </div>

            <div>
                <b>Special Packages:</b>
                6
            </div>

            <div>
                <b>Navigation:</b>
                BFS Graph
            </div>
        `;

    panel.appendChild(
        packageInfo
    );

    // ============================================================
    // 52. GET SELECTED PACKAGES
    // ============================================================

    function getSelectedPackages() {

        const result = [];

        document
            .querySelectorAll(
                ".package-check"
            )
            .forEach(
                checkbox => {

                    if (
                        checkbox.checked
                    ) {

                        const id =
                            checkbox.dataset.id;

                        const priorityInput =
                            document.querySelector(
                                `.priority-input[data-id="${id}"]`
                            );

                        result.push({
                            id,

                            priority:
                                priorityInput
                                    ? priorityInput.value
                                    : 2
                        });
                    }
                }
            );

        return result.filter(
            item => {

                const pkg =
                    packageTable.getPackage(
                        item.id
                    );

                return (
                    pkg &&
                    pkg.status ===
                    "ON_RACK"
                );
            }
        );
    }

    // ============================================================
    // 53. START DELIVERY
    // ============================================================

    function startDelivery() {

        if (
            robotState !==
            "READY"
        ) {

            updateStatus(
                "⚠️ Robot is currently busy."
            );

            return;
        }

        const selected =
            getSelectedPackages();

        if (
            selected.length === 0
        ) {

            updateStatus(
                "⚠️ Select at least one package."
            );

            return;
        }

        taskQueue.clear();

        selected.forEach(
            item => {

                taskQueue.enqueue(
                    {
                        packageId:
                            item.id
                    },
                    Number(
                        item.priority
                    )
                );
            }
        );

        const firstTask =
            taskQueue.dequeue();

        if (
            !firstTask
        ) {
            return;
        }

        activePackage =
            packageTable.getPackage(
                firstTask.packageId
            );

        startBFSVisualization(
            currentNode,
            activePackage.pickupNode
        );

        const path =
            BFS(
                warehouseGraph,
                currentNode,
                activePackage.pickupNode
            );

        currentPath =
            path;

        currentPathIndex = 0;

        robotState =
            "GOING_TO_PICKUP";

        drawRoute(
            currentPath,
            0xffff00
        );

        updateStatus(
            "🚀 Going to " +
            activePackage.id
        );
    }

    sendButton.addEventListener(
        "click",
        startDelivery
    );

    // ============================================================
    // 54. STATUS
    // ============================================================

    function updateStatus(
        message
    ) {

        statusElement.textContent =
            message;
    }

    // ============================================================
    // 55. DISABLE DELIVERED PACKAGES
    // ============================================================

    function updatePackageCheckboxes() {

        document
            .querySelectorAll(
                ".package-check"
            )
            .forEach(
                checkbox => {

                    const pkg =
                        packageTable.getPackage(
                            checkbox.dataset.id
                        );

                    if (
                        pkg &&
                        pkg.status ===
                        "DELIVERED"
                    ) {

                        checkbox.checked =
                            false;

                        checkbox.disabled =
                            true;

                        const row =
                            checkbox.closest(
                                "div"
                            );

                        if (
                            row
                        ) {

                            row.style.opacity =
                                "0.45";
                        }
                    }
                }
            );

        selectAllCheckbox.checked =
            false;
    }

    // ============================================================
    // 56. ROBOT UPDATE
    // ============================================================

    function updateRobot() {

        if (
            robotState ===
            "GOING_TO_PICKUP" ||
            robotState ===
            "GOING_TO_NEXT_PICKUP"
        ) {

            moveRobotAlongPath();

        } else if (
            robotState ===
            "PICKING_UP"
        ) {

            animatePackagePickup();

        } else if (
            robotState ===
            "GOING_TO_DELIVERY"
        ) {

            moveRobotAlongPath();

        } else if (
            robotState ===
            "DELIVERING"
        ) {

            animateAllDelivery();
        }
    }

    // ============================================================
    // 57. WAREHOUSE TITLE
    // ============================================================

    createLabel(
        "AUTONOMOUS WAREHOUSE",
        0,
        6,
        -12.5,
        4
    );

    // ============================================================
    // 58. RESIZE
    // ============================================================

    window.addEventListener(
        "resize",
        () => {

            camera.aspect =
                window.innerWidth /
                window.innerHeight;

            camera.updateProjectionMatrix();

            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );
        }
    );

    // ============================================================
    // 59. ANIMATION LOOP
    // ============================================================

    function animate() {

        requestAnimationFrame(
            animate
        );

        controls.update();

        updateRobot();

        updateDSADashboard();

        renderer.render(
            scene,
            camera
        );
    }

    animate();