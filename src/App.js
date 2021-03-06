import React from 'react';
import './App.css';
import Field from "./field/field";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userField: [],
            pcField: [],
            gameStarted: false,
            move: "",
            // hardcode
            pcShips:
                [{
                    num: 4,
                    pos: [[1, 1, "life"], [1, 2, "life"], [1, 3, "life"], [1, 4, "life"]],
                    ready: true,
                    status: "life"
                },
                    {num: 3, pos: [[3, 2, "life"], [4, 2, "life"], [5, 2, "life"]], ready: true, status: "life"},
                    {num: 3, pos: [[9, 7, "life"], [9, 8, "life"], [9, 9, "life"]], ready: true, status: "life"},
                    {num: 2, pos: [[7, 0, "life"], [8, 0, "life"]], ready: true, status: "life"},
                    {num: 2, pos: [[0, 9, "life"], [1, 9, "life"]], ready: true, status: "life"},
                    {num: 2, pos: [[3, 4, "life"], [3, 5, "life"]], ready: true, status: "life"},
                    {num: 1, pos: [[7, 5, "life"]], ready: true, status: "life"},
                    {num: 1, pos: [[5, 5, "life"]], ready: true, status: "life"},
                    {num: 1, pos: [[7, 9, "life"]], ready: true, status: "life"},
                    {num: 1, pos: [[5, 9, "life"]], ready: true, status: "life"}],

            userShips:
                [{
                    num: 4,
                    pos: [[1, 1, "life"], [1, 2, "life"], [1, 3, "life"], [1, 4, "life"]],
                    ready: true,
                    status: "life"
                },
                    {num: 3, pos: [[3, 2, "life"], [4, 2, "life"], [5, 2, "life"]], ready: true, status: "life"},
                    {num: 3, pos: [[9, 7, "life"], [9, 8, "life"], [9, 9, "life"]], ready: true, status: "life"},
                    {num: 2, pos: [[7, 0, "life"], [8, 0, "life"]], ready: true, status: "life"},
                    {num: 2, pos: [[0, 9, "life"], [1, 9, "life"]], ready: true, status: "life"},
                    {num: 2, pos: [[3, 4, "life"], [3, 5, "life"]], ready: true, status: "life"},
                    {num: 1, pos: [[7, 5, "life"]], ready: true, status: "life"},
                    {num: 1, pos: [[5, 5, "life"]], ready: true, status: "life"},
                    {num: 1, pos: [[7, 9, "life"]], ready: true, status: "life"},
                    {num: 1, pos: [[5, 9, "life"]], ready: true, status: "life"}]
        }
    }

    getRandomNumber = (min, max) => {
        let rand = min + Math.random() * (max - min);
        return Math.round(rand);
    };

    generateMissFields = (ship, array) => {
        // eslint-disable-next-line array-callback-return
        ship.pos.map((pos) => {
            let mathArr = [[0, -1], [-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1]];
            for (let i = 0; i < 8; i++) {
                let posY = pos[0] + mathArr[i][0],
                    posX = pos[1] + mathArr[i][1];
                if (posX >= 0 && posX < 10 && posY < 10 && posY >= 0)
                    array[posY][posX][1] = 'miss';
            }
        });
        return null
    };

    /*generateShips = () => {
        let arrayShips = [
            {
                num: 4,
                pos: [],
                ready: false
            },
            {
                num: 3,
                pos: [],
                ready: false
            },
            {
                num: 3,
                pos: [],
                ready: false
            },
            {
                num: 2,
                pos: [],
                ready: false
            },
            {
                num: 2,
                pos: [],
                ready: false
            },
            {
                num: 2,
                pos: [],
                ready: false
            },
            {
                num: 1,
                pos: [],
                ready: false
            },
            {
                num: 1,
                pos: [],
                ready: false
            },
            {
                num: 1,
                pos: [],
                ready: false
            },
            {
                num: 1,
                pos: [],
                ready: false
            },
        ];
        arrayShips.map(ship => {
            while (!ship.ready) {
                let posX = this.getRandomNumber(0, 10),
                    posY = this.getRandomNumber(0, 10);
                if (posX + ship.num <= 10) {
                    for (let j = 0; j < ship.num; j++) {
                        ship.pos.push([posX, posY, "life"]);
                        ship.ready = true;
                        ship.status = "life";
                        posX++;
                    }
                }
            }
        });
        return arrayShips;
    };
*/

    checkCoordinates = (coord, ships) => {
        for (let i = 0; i < ships.length; i++) {
            let ship = ships[i];
            for (let j = 0; j < ship.pos.length; j++) {
                let pos = ship.pos[j], index = j;
                if (coord[0] === pos[0] && coord[1] === pos[1]) {
                    ship.pos[index][2] = "hit";
                    let shipS = ship.pos.map(pos => {
                        return pos[2]
                    });
                    let numHits = 0;
                    shipS.map(value => value === "hit" ? numHits++ : null);
                    if (numHits === ship.num) {
                        ship.status = 'die';
                        return {
                            status: ship.status,
                            ship: ship
                        };
                    }
                    return ship.pos[index][2];
                }
            }
        }
        return 'miss'
    };

    clickToField = (info) => {
        let name = info.player + "Field";
        let array = this.state[name];
        let res = this.checkCoordinates(info.coordinates, this.state[info.player + "Ships"]);
        if (res.status === "die") {
            this.generateMissFields(res.ship, array);
            if (info.player === "user")
                this.setState({lastHit: null});
            // eslint-disable-next-line array-callback-return
            res.ship.pos.map(pos => {
                array[pos[0]][pos[1]][1] = res.status;
            });
            if (this.shipsIsLive(info.player) === 10) {
                this.gameEnd(info.player);
            }
        } else
            array[info.coordinates[0]][info.coordinates[1]][1] = res;
        if (res === 'miss') {
            let nextMove = info.player === 'user' ? 'user' : 'pc';
            this.setState({move: nextMove});
        }
        if (res === 'hit') {
            if (info.player === "user")
                this.setState({lastHit: info.coordinates});
            // рисует точки по диагонали при попадании
            if (info.coordinates[0] + 1 < 10 && info.coordinates[1] + 1 < 10)
                array[info.coordinates[0] + 1][info.coordinates[1] + 1][1] = "miss";
            if (info.coordinates[0] + 1 < 10 && info.coordinates[1] - 1 >= 0)
                array[info.coordinates[0] + 1][info.coordinates[1] - 1][1] = "miss";
            if (info.coordinates[0] - 1 >= 0 && info.coordinates[1] + 1 < 10)
                array[info.coordinates[0] - 1][info.coordinates[1] + 1][1] = "miss";
            if (info.coordinates[0] - 1 >= 0 && info.coordinates[1] - 1 >= 0)
                array[info.coordinates[0] - 1][info.coordinates[1] - 1][1] = "miss";
        }
        this.setState({[name]: array});
    };

    renderFields = () => {
        let col = [];
        for (let i = 0; i < 10; i++) {
            let tmp_col = [];
            for (let j = 0; j < 10; j++) {
                let obj = [
                    [i, j],
                    'none'
                ];
                tmp_col.push(obj);
            }
            col.push(tmp_col);
        }
        return col;
    };

    renderUserShips = () => {
        let array = this.state.userField;
        // eslint-disable-next-line array-callback-return
        this.state.userShips.map(ship => {
            // eslint-disable-next-line array-callback-return
            ship.pos.map(pos => {
                array[pos[0]][pos[1]][1] = 'ship';
            });
        });
    };

    startGame = () => {
        if (!this.state.gameStarted) {
            // this.setState({userShips: this.generateShips()});
            // this.setState({pcShips: this.generateShips()});
            this.setState({gameStarted: true});
            this.renderUserShips();
            this.setState({move: "user"});
        }
    };

    shipsIsLive = (player) => {
        let ships = this.state[player + "Ships"];
        let dead = 0;
        ships.map(ship => ship.status === "die" ? dead++ : null);
        return dead
    };

    setFields = () => {
        this.setState({userField: this.renderFields()});
        this.setState({pcField: this.renderFields()});
    };

    componentDidMount() {
        this.setFields();
    }

    isEmptyField = (coord) => {
        let field = this.state.userField;
        let row = field[coord[0]];
        let fieldN = row[coord[1]];
        if (fieldN[1] === 'none' || fieldN[1] === 'ship')
            return true;
        return false
    };

    movePC = () => {
        if (this.state.lastHit == null) {
            let posX = this.getRandomNumber(0, 9),
                posY = this.getRandomNumber(0, 9);
            while (!this.isEmptyField([posY, posX])) {
                posX = this.getRandomNumber(0, 9);
                posY = this.getRandomNumber(0, 9);
            }
            setTimeout(this.clickToField({
                player: 'user',
                coordinates: [posY, posX]
            }), 500);
        } else {
            let pos = this.state.lastHit;
            let mathArr = [[0, -1], [-1, 0], [0, 1], [1, 0]];
            for (let i = 0; i < mathArr.length; i++) {
                let posY = pos[0] + mathArr[i][0],
                    posX = pos[1] + mathArr[i][1];
                if (posX >= 0 && posX < 10 && posY < 10 && posY >= 0 && this.isEmptyField([posY, posX])) {
                    setTimeout(this.clickToField({
                        player: 'user',
                        coordinates: [posY, posX]
                    }), 500);
                    break;
                }
            }
            this.setState({lastHit: null});
        }
    };

    componentDidUpdate() {
        if (this.state.move === 'pc') {
            setTimeout(this.movePC, 400);
        }
    }

    gameEnd(player) {
        this.setState({gameStarted: false});
        this.setState({gameIsEnd: true});
        alert("Проиграл " + player.toUpperCase());
        document.location.reload();
    }

    render() {
        return <div className="main">
            <div className="fields">
                <Field name="user" click={this.clickToField} move={this.state.move} gameStarted={this.state.gameStarted}
                       field={this.state.userField}/>
                <Field name="pc" click={this.clickToField} move={this.state.move} gameStarted={this.state.gameStarted}
                       field={this.state.pcField}/>
            </div>
            {this.state.gameStarted ? null :
                <button onClick={this.startGame}>Start</button>
            }
        </div>;
    }
}

export default App;
