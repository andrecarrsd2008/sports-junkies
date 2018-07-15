import React, { Component } from 'react';
import Navbar from '../../components/Navbar';
import API from '../../utils/API';
import SavedBet from '../../components/SavedBet';
import { Grid, Cell } from 'react-mdl';
import './saved.css';


class Saved extends Component {
    constructor(props) {
        super(props)
        this.state = {
            savedBets: [],
            userID: '5b4a46dc247d765f6c0e3a55',
            user_name: ''
        }
        this.getUsersBets = this.getUsersBets.bind(this)
    }
    
    componentDidMount() {
        this.getUsersBets()
    }
    getUsersBets() {
        this.setState({savedBets: []})
        API.getUsersBets(this.state.userID)
            .then(res=> {
                this.setState({ savedBets: res.data.bets, user_name: res.data.username})
            })
            .catch(err=> {
                console.log(err)
            })
    }

    render() {
        return (
            <div>
                <Navbar />
                <Grid className="demo-grid-1">
                    <Cell col={12}><h2>{this.state.user_name}'s Tracked Bets</h2></Cell>
                </Grid>
                <div>
                    {this.state.savedBets.map(bet=> {
                        return (
                            <div className="saved-bet">
                                <Cell col={3} key={bet.key}>
                                    <SavedBet bet={bet} />
                                </Cell>                                   
                            </div> 
                    )})}
                </div>
            </div>
        )
    }
}

export default Saved;