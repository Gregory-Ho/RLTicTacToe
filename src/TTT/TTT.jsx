import React from "react";
import "./TTT.css"
import * as Constants from "./Constants"
import Board from "./Board"

class TTT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: Array(9).fill(Constants.EMPTY),
            isGameFinished: false,
            currentPlayer: Constants.X
        }
    }

    componentDidMount() {
        this.playModelAction(this.state.board);
    }

    nextPlayer(currentPlayer) {
        return currentPlayer === Constants.X ? Constants.O : Constants.X;
    }

    resetBoard(){
        this.setState({
            board: Array(9).fill(Constants.EMPTY),
            isGameFinished: false,
            currentPlayer: Constants.X
        }, () => this.playModelAction(this.state.board));
    }

    checkGameEnded(board, action, player) {
        const DIAG1 = [0,4,8];
        const DIAG2 = [2,4,6];

        let col = action % 3;
        let row = Math.floor(action / 3);
        //  Horizontal
        for (let i = 0; i < 3; i++){
            if (board[row * 3 + i] !== player){
                break;
            }
            if (i === 2){
                return true;
            }
        }
        // Vertical
        for (let i = 0; i < 3; i++){
            if (board[col + 3 * i] !== player){
                break;
            }
            if (i === 2){
                return true;
            }
        }
        // Diagonals
        if (action % 2 === 0) {
            if (DIAG1.includes(action)){
                for (const diagIndex of DIAG1){
                    if (board[diagIndex] !== player){
                        break;
                    }
                    if (diagIndex === DIAG1[DIAG1.length - 1]){
                        return true
                    }
                }
            }

            if (DIAG2.includes(action)){
                for (const diagIndex of DIAG2){
                    if (board[diagIndex] !== player){
                        break;
                    }
                    if (diagIndex === DIAG2[DIAG2.length - 1]){
                        return true
                    }
                }
            }
        }
        return false
    }

    printAPIError(response){
        alert("Sorry, there was an error communicating with the model. Please try again later.");
        console.log(response);
    }

    async playModelAction(board) {
        let response = await fetch(Constants.TTT_SERVING_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: [this.state.board]
            })
        }).then((response) => {
            if (response.status !== 200) {
                this.printAPIError(response);
            } else {
                return response.json();
            }
        }).catch((error) => this.printAPIError(error));

        let logits = response["outputs"][0];
        logits = logits.map((val, index) => this.state.board[index] !== 0 ? Number.MIN_SAFE_INTEGER : val);
        this.playAction(logits.indexOf(Math.max(...logits)));
    }

    playAction(action) {
        if (this.state.isGameFinished || this.state.board[action] !== Constants.EMPTY) {
            return
        }
        let player = this.state.currentPlayer;
        let newBoard = this.state.board;
        newBoard[action] = player;

        this.setState( {
            board: newBoard,
            isGameFinished: this.checkGameEnded(newBoard, action, player),
            currentPlayer: this.nextPlayer(player)
        }, () => {
            if (this.state.currentPlayer === Constants.X) {
                this.playModelAction();
            }
        })
    }

    render() {
        let playAction = action => {this.playAction(action)}
        return(
            <div id="TTT">
                <h1 className="title">Play Against The Trained RL Model</h1>
                <Board board={this.state.board} playAction={playAction} currentPlayer={this.state.currentPlayer}/>
                <button className="reset-button" onClick={(e) => {this.resetBoard()}}>Reset Board</button>
            </div>
        );
    }
}
export default TTT;