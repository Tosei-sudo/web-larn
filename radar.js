const MOVE_RATE = 1;

function getColorByAffiliation(affiliation) {
    if (affiliation === 'enemy') {
        return 'red';
    } else if (affiliation === 'ally') {
        return 'blue';
    } else {
        return 'white';
    }
}

// target Type
// 1: to ship
// 2: to missile
// 4: to fighter
// 8: to ground
const TARGET_SHIP = 1;
const TARGET_MISSILE = 2;
const TARGET_FIGHTER = 4;
const TARGET_GROUND = 8;

function setup() {

    const { createApp, ref } = Vue

    createApp({
        data() {
            return {
                ctx: null,
                counter: 0,
                finded_objects: [
                ],
                myObject: {},
                isAssingActions: false,
                assingTarget: null,
                weaponAssings: {},
                activeSelectWeapon: "",
            }
        },
        methods: {
            setup() {
                const canvas = document.getElementById('canvas');
                canvas.height = 800;
                canvas.width = 800;
                this.ctx = canvas.getContext('2d');

                let obj = this.addFindedObject(450, 500, 0, 0, 0, 0, 'ally', TARGET_SHIP, null, 'OurShip', [
                    {
                        uid: null,
                        name: 'SM-3',
                        range: 300,
                        speed: .15,
                        status: 1,
                        targetType: TARGET_FIGHTER | TARGET_MISSILE
                    },
                    {
                        uid: null,
                        name: 'SM-3',
                        range: 300,
                        speed: .15,
                        status: 1,
                        targetType: TARGET_FIGHTER | TARGET_MISSILE
                    },
                    {
                        uid: null,
                        name: 'SM-3',
                        range: 300,
                        speed: .15,
                        status: 1,
                        targetType: TARGET_FIGHTER | TARGET_MISSILE
                    },
                    {
                        uid: null,
                        name: 'SM-3',
                        range: 300,
                        speed: .15,
                        status: 1,
                        targetType: TARGET_FIGHTER | TARGET_MISSILE
                    }
                ]);
                obj.datalinked = true;

                let obj2 = this.addFindedObject(450, 500, 15, 0.1, Math.PI * 3 / 2, 0, 'ally', TARGET_FIGHTER, null, 'Fighter01', [
                    {
                        uid: null,
                        name: 'AMRAAM',
                        range: 300,
                        speed: .15,
                        status: 1,
                        targetType: TARGET_FIGHTER | TARGET_MISSILE
                    },
                    {
                        uid: null,
                        name: 'AMRAAM',
                        range: 300,
                        speed: .15,
                        status: 1,
                        targetType: TARGET_FIGHTER | TARGET_MISSILE
                    },
                    {
                        uid: null,
                        name: 'AMRAAM',
                        range: 300,
                        speed: .15,
                        status: 1,
                        targetType: TARGET_FIGHTER | TARGET_MISSILE
                    },
                    {
                        uid: null,
                        name: 'AMRAAM',
                        range: 300,
                        speed: .15,
                        status: 1,
                        targetType: TARGET_FIGHTER | TARGET_MISSILE
                    }
                ]);
                obj2.datalinked = true;

                let myWeapons = [];
                for (let index = 0; index < 24; index++) {
                    myWeapons.push({
                        uid: `SM-2-${index}`,
                        name: 'SM-2',
                        range: 300,
                        speed: 0.1,
                        status: 1,
                        targetType: TARGET_FIGHTER | TARGET_MISSILE
                    });
                }
                for (let index = 0; index < 24; index++) {
                    myWeapons.push({
                        uid: `SM-3-${index}`,
                        name: 'SM-3',
                        range: 300,
                        speed: 0.15,
                        status: 1,
                        targetType: TARGET_FIGHTER | TARGET_MISSILE
                    });
                }
                for (let index = 0; index < 8; index++) {
                    myWeapons.push({
                        uid: `Harpoon-${index}`,
                        name: 'Harpoon',
                        range: 300,
                        speed: .2,
                        status: 1,
                        targetType: TARGET_SHIP
                    });
                }
                myWeapons.push({
                    uid: `OurShip`,
                    name: 'DataLink',
                    status: 1,
                    obj: obj,
                    targetType: TARGET_MISSILE | TARGET_FIGHTER
                });
                myWeapons.push({
                    uid: obj2.fuid,
                    name: 'DataLink',
                    status: 1,
                    obj: obj2,
                    targetType: TARGET_SHIP | TARGET_MISSILE | TARGET_FIGHTER
                });
                this.activeSelectWeapon = myWeapons[0].name;

                this.myObject = this.addFindedObject(400, 400, 0, 0, 0, 0, 'ally', TARGET_SHIP, null, 'My Ship', myWeapons);
                this.myObject.datalinked = true;

                const enemyWeapons = [
                    {
                        uid: null,
                        name: '5V55RM',
                        range: 300,
                        speed: 0.1,
                        status: 1,
                        targetType: TARGET_SHIP
                    },
                    {
                        uid: null,
                        name: '5V55RM',
                        range: 300,
                        speed: 0.1,
                        status: 1,
                        targetType: TARGET_SHIP
                    },
                    // {
                    //     uid: "5V55RM-03",
                    //     name: '5V55RM',
                    //     range: 300,
                    //     speed: 0.1,
                    //     status: 1,
                    //     targetType: TARGET_SHIP
                    // },
                    // {
                    //     uid: "5V55RM-04",
                    //     name: '5V55RM',
                    //     range: 300,
                    //     speed: 0.1,
                    //     status: 1,
                    //     targetType: TARGET_SHIP
                    // },
                ];
                this.addFindedObject(400, 60, 0, 0, Math.PI / 5, 0, 'enemy', TARGET_SHIP, null, 'Enemy Ship', [{
                    name: '5V55RM',
                    range: 300,
                    speed: .2,
                    status: 1,
                    targetType: TARGET_FIGHTER | TARGET_MISSILE
                }]);
                this.addFindedObject(490, 580, 0, 0.01, -Math.PI / 5, 0, 'enemy', TARGET_SHIP, null, null, []);
                this.addFindedObject(60, 350, 50, .12, Math.PI / 5, 0, 'enemy', TARGET_FIGHTER, null, null, enemyWeapons);

                this.allRender();
                setInterval(this.allRender, 1000 / 60);
            },
            addFindedObject(
                x = 1, y = 1, z = 0,
                v = 1, angle = Math.PI, elevationAngle = 0,
                affiliation, type = TARGET_FIGHTER, target = null,
                fuid = null, myWeapons = []
            ) {
                function getFUID() {
                    return Math.random().toString(36).slice(-8);
                }

                let render;
                if (type === TARGET_MISSILE) {
                    render = this.missileRender;
                } else if (type === TARGET_SHIP) {
                    render = this.shipRender;
                } else if (type === TARGET_FIGHTER) {
                    render = this.fighterRender;
                }

                if (fuid === null) {
                    fuid = getFUID();
                }

                let obj = {
                    fuid,
                    x: x,
                    y: y,
                    z: z,
                    vx: v * Math.cos(angle) * Math.cos(elevationAngle),
                    vy: v * Math.sin(angle) * Math.cos(elevationAngle),
                    vz: v * Math.sin(elevationAngle),
                    v,
                    affiliation: affiliation,
                    target: target,
                    type: type,
                    lockon: false,
                    myWeapons,
                    render,
                    launchMissile: (target) => this.launchMissile(obj, target),
                    wake: [[], [], []],
                };
                this.finded_objects.push(obj);
                return obj;
            },
            setLockon(obj) {
                obj.lockon = true;
            },
            setLockout(obj) {
                obj.lockon = false;

                // remove weaponAssings in obj.fuid
                if (obj.fuid in this.weaponAssings) {
                    if (this.weaponAssings[obj.fuid].status === 2) {
                        this.weaponAssings[obj.fuid].status = 1;
                    }
                    delete this.weaponAssings[obj.fuid];
                }
            },
            startAssing(obj) {
                this.isAssingActions = true;
                this.assingTarget = obj;
            },
            assingWeapon(weapon) {
                if (this.assingTarget === null) { return; }
                if (this.assingTarget.fuid in this.weaponAssings) {
                    this.weaponAssings[this.assingTarget.fuid].status = 1;
                }

                this.weaponAssings[this.assingTarget.fuid] = weapon;
                weapon.status = 2;
                this.isAssingActions = false;
                this.assingTarget = null;
            },
            launchMissile: function (obj, target = undefined) {
                if (target !== undefined) {
                    let weapon;
                    if (!(target.fuid in this.weaponAssings)) {
                        // auto assing
                        weapon = obj.myWeapons.filter(w => (w.status === 1 && (w.targetType & target.type) > 0))[0];
                    } else {
                        weapon = this.weaponAssings[target.fuid];
                        delete this.weaponAssings[target.fuid];
                    }
                    if (weapon === undefined) { return; }
                    if (weapon.name === 'DataLink') {
                        this.launchMissile(weapon.obj, target);
                        weapon.status = 1;
                        return;
                    } else {
                        weapon.status = 3;
                        let angle = Math.atan2(target.y - obj.y, target.x - obj.x);

                        let elevetionAngle = Math.PI / 6;
                        if (target.z !== obj.z) {
                            elevetionAngle = Math.atan2(target.z - obj.z, Math.sqrt((target.x - obj.x) ** 2 + (target.y - obj.y) ** 2));
                        }

                        this.addFindedObject(obj.x, obj.y, obj.z, weapon.speed, angle, elevetionAngle, obj.affiliation, TARGET_MISSILE, target, weapon.uid);
                        // status : 3 を下に並び替え
                        obj.myWeapons = obj.myWeapons.sort((a, b) => a.status - b.status);
                    }
                }
            },
            getPredictedPosition(obj, target) {
                let t = Math.sqrt((obj.x - target.x) ** 2 + (obj.y - target.y) ** 2 + (obj.z - target.z) ** 2) / (obj.v + target.v);
                return {
                    x: target.x + target.vx * t,
                    y: target.y + target.vy * t,
                    z: target.z + target.vz * t,
                }
            },
            // 以下描画関連
            allRender() {
                this.ctx.fillStyle = 'black';
                this.ctx.fillRect(0, 0, canvas.width, canvas.height);

                let radius = [50, 100, 150, 200, 250, 300, 350];
                radius.forEach(r => this.drawCircle(r));

                this.drawRadarLine(Math.PI / 2);
                this.drawRadarLine(Math.PI);
                this.drawRadarLine(Math.PI * 3 / 2);
                this.drawRadarLine(Math.PI * 2);

                this.drawActiveRadarLine(Math.PI * (3 / 2 + Date.now() / 1000 * 0.6));

                this.drawFindedObjects();
            },
            drawActiveRadarLine(angle) {
                this.ctx.strokeStyle = 'red';
                this.ctx.beginPath();
                this.ctx.lineWidth = 2;
                this.ctx.moveTo(400, 400);
                this.ctx.lineTo(400 + 350 * Math.cos(angle), 400 + 350 * Math.sin(angle));
                // bold
                this.ctx.stroke();
            },
            drawRadarLine(angle) {
                this.ctx.strokeStyle = 'yellowgreen';
                this.ctx.beginPath();
                this.ctx.moveTo(400, 400);
                this.ctx.lineTo(400 + 350 * Math.cos(angle), 400 + 350 * Math.sin(angle));
                this.ctx.stroke();
            },
            drawCircle(radius) {
                this.ctx.strokeStyle = 'yellowgreen';
                this.ctx.beginPath();
                this.ctx.arc(400, 400, radius, 0, 2 * Math.PI);
                this.ctx.stroke();
            },
            drawFindedObjects() {
                this.finded_objects.forEach(obj => obj.render(obj));
            },
            commonRender(obj, callback = () => { }) {
                obj.wake[0].push(obj.x);
                obj.wake[1].push(obj.y);
                obj.wake[2].push(obj.z);
                obj.x += obj.vx * MOVE_RATE;
                obj.y += obj.vy * MOVE_RATE;
                obj.z += obj.vz * MOVE_RATE;

                if (Math.sqrt((obj.x - 400) ** 2 + (obj.y - 400) ** 2) > 350) {
                    this.finded_objects = this.finded_objects.filter(o => o !== obj);
                    return false;
                }

                this.ctx.fillStyle = getColorByAffiliation(obj.affiliation);
                this.ctx.strokeStyle = getColorByAffiliation(obj.affiliation);

                callback();

                if (obj.lockon) {
                    this.ctx.fillStyle = 'yellow';
                } else {
                    this.ctx.fillStyle = 'white';
                }

                this.ctx.font = "10px";
                this.ctx.fillText(`${obj.fuid}(${Math.floor(obj.z)})`, obj.x, obj.y);
                if (obj.datalinked) {
                    this.ctx.fillStyle = 'yellowgreen';
                    this.ctx.fillText('LINK', obj.x, obj.y + 10);
                }
                return true;
            },
            fighterRender(obj) {
                this.commonRender(obj, () => {
                    this.ctx.fillRect(obj.x - 5, obj.y - 5, 10, 10);
                });
                if (Math.random() < 0.001 && obj.affiliation == 'enemy') {
                    // targetを探す
                    let targets = this.finded_objects.filter(o => o.affiliation === 'ally');
                    if (targets.length > 0) {
                        let index = Math.floor(Math.random() * targets.length);
                        let target = targets[index];

                        this.launchMissile(obj, target);
                    }
                }
            },
            missileRender(obj) {
                if ("target" in obj && obj.target !== null) {
                    if (obj.target.destroyed) {
                        this.finded_objects = this.finded_objects.filter(o => (o !== obj));
                    }
                    let distance_2d = Math.sqrt((obj.x - obj.target.x) ** 2 + (obj.y - obj.target.y) ** 2);
                    let distance = Math.sqrt((obj.x - obj.target.x) ** 2 + (obj.y - obj.target.y) ** 2 + (obj.z - obj.target.z) ** 2);
                    if (distance_2d < 150) {
                        // 誘導演算
                        let predictedPosition = { x: null, y: null, z: null };
                        // 今のまま進んだとき何秒後にtargetに到達するか
                        let t = distance / (obj.v + obj.target.v);
                        predictedPosition.x = obj.target.x + obj.target.vx * t;
                        predictedPosition.y = obj.target.y + obj.target.vy * t;
                        predictedPosition.z = obj.target.z + obj.target.vz * t;

                        let distance_predicted = Math.sqrt((obj.x - predictedPosition.x) ** 2 + (obj.y - predictedPosition.y) ** 2 + (obj.z - predictedPosition.z) ** 2);

                        let angle, elevationAngle;
                        if (distance_predicted < obj.v) {
                            angle = Math.atan2(obj.target.y - obj.y, obj.target.x - obj.x);
                            elevationAngle = Math.atan2(obj.target.z - obj.z, Math.sqrt((obj.target.x - obj.x) ** 2 + (obj.target.y - obj.y) ** 2));
                        } else {
                            angle = Math.atan2(predictedPosition.y - obj.y, predictedPosition.x - obj.x);
                            elevationAngle = Math.atan2(predictedPosition.z - obj.z, Math.sqrt((predictedPosition.x - obj.x) ** 2 + (predictedPosition.y - obj.y) ** 2));
                        }
                        obj.vx = obj.v * Math.cos(angle) * Math.cos(elevationAngle);
                        obj.vy = obj.v * Math.sin(angle) * Math.cos(elevationAngle);
                        obj.vz = obj.v * Math.sin(elevationAngle);
                    }
                    // 衝突判定　本来は円と円の衝突判定を行うべきだが、今回は簡易的に距離で判定
                    if (distance < 1) {
                        obj.target.destroyed = true;
                        obj.destroyed = true;
                        this.finded_objects = this.finded_objects.filter(o => (o !== obj.target && o !== obj));
                        console.log(obj.wake)
                        console.log(obj.target.wake);
                    }
                }
                this.commonRender(obj, () => {
                    this.ctx.beginPath();
                    this.ctx.moveTo(obj.x - 5, obj.y + 5);
                    this.ctx.lineTo(obj.x + 5, obj.y + 5);
                    this.ctx.lineTo(obj.x, obj.y - 5);
                    this.ctx.fill();
                    this.ctx.closePath();
                    this.ctx.stroke();
                    if (obj.affiliation === 'ally') {
                        // show target fuid in missile
                        this.ctx.fillStyle = 'white';
                        this.ctx.font = "10px";
                        this.ctx.fillText(obj.target.fuid, obj.x, obj.y + 10);
                    }
                });
            },
            shipRender(obj) {
                this.commonRender(obj, () => {
                    this.ctx.beginPath();
                    this.ctx.arc(obj.x, obj.y, 5, 0, 2 * Math.PI);
                    this.ctx.fill();
                    this.ctx.stroke();

                    // ランダムでミサイルを発射してみる
                    if (Math.random() < 0.001 && obj.affiliation == 'enemy') {
                        let targets = this.finded_objects.filter(o => o.affiliation === 'ally');
                        if (targets.length > 0) {
                            let index = Math.floor(Math.random() * targets.length);
                            let target = targets[index];

                            this.launchMissile(obj, target);
                        }
                    }
                });
            },
            // 表示テキスト取得
            getPositionString: (obj) => {
                return `${Math.floor(obj.x)}, ${Math.floor(obj.y)}, ${Math.floor(obj.z)}, ${Math.floor(obj.v * 1000)}`;
            },
            getStatusString: (weapon) => {
                if (weapon.status === 1) {
                    return 'ready';
                } else if (weapon.status === 2) {
                    return 'assing';
                }
                return 'fired';
            },
            getTypeString: (type) => {
                if (type === TARGET_SHIP) {
                    return 'ship';
                } else if (type === TARGET_MISSILE) {
                    return 'missile';
                } else if (type === TARGET_FIGHTER) {
                    return 'fighter';
                }
            },
        },
        computed: {
            lockoned_objects() {
                return this.finded_objects.filter(o => o.lockon);
            },
            not_me_objects() {
                return this.finded_objects.filter(o => o.fuid !== 'My Ship');
            },
            weaponNameList() {
                if (!this.myObject.myWeapons) {
                    return [];
                }
                let names = {};
                this.myObject.myWeapons.forEach(w => {
                    names[w.name] = true;
                });
                return Object.keys(names);
            },
            filterdMyWeapons() {
                if (!this.myObject.myWeapons) {
                    return [];
                }
                return this.myObject.myWeapons.filter(w => w.name === this.activeSelectWeapon).sort((a, b) => a.status - b.status);
            }
        },
        mounted() {
            this.setup();
        }
    }).mount('#app');
}

window.onload = () => {
    setup();
}