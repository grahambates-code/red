import React, {Fragment, useState} from 'react';

import {Button, notification} from 'antd';

import { Slider} from '@material-ui/core';

import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';

import { ApolloProvider } from "react-apollo";

import { Query, Mutation } from "react-apollo";

import VintageMap from './Maps/VintageMap'
import deckGl from 'deck.gl';

export default class WebMapView extends React.Component {

    state = {
        uBrightness : 1.0,
        uBlackWhiteCoef : 0.8,
        trip : 1,
        uTargetRes : 200
    };

    render () {

        if (true) return <Fragment>
            <div>
                 <Slider // uBlackWhiteCoef
                    min={0.0}
                    max={1}
                    step={0.01}
                    style={{zIndex : 999999999999}}
                    onChange={(_,e) => this.setState({uBlackWhiteCoef : e})}
                    initalValue={0}
                />
                <Slider // uTargetRes
                    min={2}
                    max={500}
                    step={1}
                    style={{zIndex : 999999999999}}
                    onChange={(_,e) => this.setState({uTargetRes : e})}
                    initalValue={200}
                    defaultValue={200}
                    valueLabelDisplay={'on'}
                />
            </div>

            <VintageMap
                uBrightness={this.state.uBrightness} // dither
                bGrayscale = {false} // grayscale on / off
                uBlackWhiteCoef = {this.state.uBlackWhiteCoef}
                uTargetRes={this.state.uTargetRes}
            />

        </Fragment>

    }
}
