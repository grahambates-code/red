/* eslint-disable max-statements */
import React, {useState} from 'react';

import {BitmapLayer} from '@deck.gl/layers';

import {TileLayer} from '@deck.gl/geo-layers';

const tilelayer = new TileLayer({

    data : 'https://api.mapbox.com/styles/v1/mogmog/ck8ab16k20dw61imtg6hlx44k/draft/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibW9nbW9nIiwiYSI6ImNpZmI2eTZuZTAwNjJ0Y2x4a2g4cDIzZTcifQ.qlITXIamvfVj-NCTtAGylw',

    renderSubLayers: props => {
        const {
            bbox: {west, south, east, north}
        } = props.tile;

        return new BitmapLayer(props, {

            data: null,
            image: props.data,


            opacity : 1,

            bounds: [west, south, east, north]
        });
    }
});

export default tilelayer;
