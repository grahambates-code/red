import React, {Fragment, useState} from 'react';
import DeckGL from '@deck.gl/react';
import {MapController} from '@deck.gl/core';
import {OrbitView, COORDINATE_SYSTEM} from '@deck.gl/core';
import {SimpleMeshLayer} from '@deck.gl/mesh-layers';
import {Component} from 'react';
import _ from "lodash";
import {CubeGeometry, SphereGeometry} from '@luma.gl/engine';

import {brightnessContrast, dotScreen} from '@luma.gl/shadertools';
import {PostProcessEffect} from '@deck.gl/core';
import {ScenegraphLayer} from "@deck.gl/mesh-layers";

import { dither2x2, dither4x4, dither8x8, dither }  from './../../Effects/Dither';
import { grayscale, blackWhiteRed } from './../../Effects/Color';

import {AmbientLight, DirectionalLight, LightingEffect} from '@deck.gl/core';
import { Slider} from '@material-ui/core';

const postProcessEffect = new PostProcessEffect(dotScreen, {});

export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            intensity : 2.9,
            position_x : 6.1,
            position_y : -5,
            position_z : 5,
            viewState: {

                rotationOrbit: -5.146453089244853,
                rotationX: 22.853688029020553,
                target: [1641.830961712021, 2781.4144747331898, 3407.153549407324],
                transitionDuration: 0,
                zoom: -3.0854625620045026
            },
        };
        this.debounce  = _.debounce(e => e(), 300);
    }

    render() {

        const cl3 = new DirectionalLight({
            color: [255, 255, 255],
            direction: [this.state.position_x, this.state.position_y, this.state.position_z],
            intensity: this.state.intensity
        });

        // create ambient light source
        const ambientLight = new AmbientLight({
            color: [255, 255, 255],
            intensity: 0.2
        });

        const effects = [];


            const ditherEffect = new PostProcessEffect(
                dither,
                {
                    uTargetRes: this.props.uTargetRes
                }
            );

            const grayscaleEffect = new PostProcessEffect(
                grayscale,
                {
                    uColorFactor : this.props.uBlackWhiteCoef // 0..1 - 0 fully gray; 1 - fully colored
                }
            );

        effects.push(ditherEffect);
       // effects.push(grayscaleEffect);
        effects.push(new LightingEffect({ ambientLight, cl3}));

        return (
            <div>

                <div className="xDeck" >

                    <div className="poster" style={{position : 'relative', marginTop : '100px'}}>
                        <DeckGL

                            viewState={this.state.viewState}
                            views={[new OrbitView({fov: 60})]}
                            controller={true}
                            height="300px"
                            width="300px"
                            effects={effects}
                            ref={deck => {
                                this.deckGL = deck;
                            }}

                            onViewStateChange={({viewId, viewState}) => {
                                this.setState({viewState});
                            }
                            }

                            layers={
                                [

                                    new ScenegraphLayer({ data : [{position : [0,0,0]}],

                                        scenegraph : 'models/venus.glb',

                                        coordinateSystem: COORDINATE_SYSTEM.IDENTITY,

                                        opacity : 1,

                                        material: {
                                            ambient: 0.2,
                                            diffuse: 0.8
                                        },
                                        getPosition: d => d.position,
                                        //getColor: d => d.color,
                                        getScale: [3, 3, 3],

                                        getOrientation: asset => [0, 0, 90 ],

                                        sizeScale: 10,

                                        _lighting: 'pbr'
                                    })

                                ]
                            }/>
                    </div>

                </div>

            </div>
        );
    }
}
