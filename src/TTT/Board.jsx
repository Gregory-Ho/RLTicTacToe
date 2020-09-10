import React from "react";
import "./Board.css"
import * as Constants from "./Constants"

class Board extends React.Component {
    X() {
        return <div className="X"/>
    }

    O() {
        return <div className="O"/>
    }

    getInnerBox(index) {
        switch (this.props.board[index]){
            case Constants.X:
                return this.X();
            case Constants.O:
                return this.O();
            default:
                return
        }
    }

    handleBoxClicked(action) {
        if (this.props.currentPlayer === Constants.O) {
            this.props.playAction(action);
        }
    }

    render() {
        let boxes = []
        const boxClassNameTuples = [
            ["box top left", 6],
            ["box top", 7],
            ["box top right", 8],
            ["box left", 3],
            ["box", 4],
            ["box right", 5],
            ["box bottom left", 0],
            ["box bottom", 1],
            ["box bottom right", 2]
        ]
        boxClassNameTuples.forEach((tuple) => {
            boxes.push(
                <div className={tuple[0]} onClick={(e) => this.handleBoxClicked(tuple[1])} key={"board-slot-" + tuple[1]}>
                    {this.getInnerBox(tuple[1])}
                </div>
            );
        });

        return(
            <div className="game-board">
                {boxes}
            </div>
        );
    }
}
export default Board;