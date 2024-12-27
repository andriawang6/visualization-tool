// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
// conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
// of conditions and the following disclaimer in the documentation and/or other materials
// provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY <COPYRIGHT HOLDER> ``AS IS'' AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
// ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// The views and conclusions contained in the software and documentation are those of the
// authors and should not be interpreted as representing official policies, either expressed
// or implied, of the University of San Francisco

import {
	addControlToAlgorithmBar,
	addDivisorToAlgorithmBar,
	addGroupToAlgorithmBar,
	addLabelToAlgorithmBar,
	addRadioButtonGroupToAlgorithmBar,
} from './Algorithm.js';
import { BFS_DFS_ADJ_LIST } from './util/GraphValues';
import Graph from './Graph.js';
import { act } from '../anim/AnimationMain';
import pseudocodeText from '../pseudocode.json';

const DFS_STACK_TOP_COLOR = '#0000FF';
const VISITED_COLOR = '#99CCFF';

const INFO_MSG_X = 25;
const INFO_MSG_Y = 15;

const LIST_START_X = 30;
const LIST_START_Y = 70;
const LIST_SPACING = 20;

const VISITED_START_X = 30;
const VISITED_START_Y = 120;

const CURRENT_VERTEX_LABEL_X = 25;
const CURRENT_VERTEX_LABEL_Y = 145;
const CURRENT_VERTEX_X = 115;
const CURRENT_VERTEX_Y = 151;

const STACK_LABEL_X = 25;
const STACK_LABEL_Y = 170;

const STACK_START_X = 40;
const SMALL_STACK_START_Y = 335;
const LARGE_STACK_START_Y = 465;
const SMALL_STACK_SPACING = 20;
const LARGE_STACK_SPACING = 16;

const RECURSION_START_X = 125;
const RECURSION_START_Y = 185;
const SMALL_RECURSION_SPACING_X = 20;
const LARGE_RECURSION_SPACING_X = 10;
const SMALL_RECURSION_SPACING_Y = 20;
const LARGE_RECURSION_SPACING_Y = 15;

const CODE_START_X = 1000;
const CODE_START_Y = 50;

export default class GraphCreate extends Graph {
	constructor(am, w, h) {
		super(am, w, h, BFS_DFS_ADJ_LIST);
		this.addControls();
	}

	addControls() {
		addLabelToAlgorithmBar('Adjacency List: ');
		const verticalGroup = addGroupToAlgorithmBar(false);
		const horizontalGroup = addGroupToAlgorithmBar(true, verticalGroup);
		// List text field
		this.listField = document.createElement('textarea'); 
  		this.listField.classList.add('scrollable-textbox'); // Add a CSS class for styling
  		this.listField.style.width = '200px'; // Adjust width
  		this.listField.style.height = '100px'; // Adjust height

		// Add an input event listener to restrict input
		this.listField.addEventListener('input', function(event) {
    	const allowedPattern = /^[A-H->,\n]*$/; // Capital letters, ->, and spaces
    	if (!allowedPattern.test(this.value)) {
        	const cursorPosition = this.selectionStart - 1;
        	this.value = this.value.replace(/[^A-H->,\n]/g, ''); // Remove invalid characters
        	this.setSelectionRange(cursorPosition, cursorPosition); // Preserve cursor position
    	}
		});

  		horizontalGroup.appendChild(this.listField);
		addDivisorToAlgorithmBar();
		this.runButton = addControlToAlgorithmBar('Button', 'Run');
		this.runButton.onclick = this.startCallback.bind(this);
		this.controls.push(this.runButton);
	}

	setup(adjMatrix) {
		super.setup(adjMatrix);
		this.commands = [];
		this.messageID = [];

		this.visited = [];

		this.stackID = [];
		this.listID = [];
		this.visitedID = [];

		this.infoLabelID = this.nextIndex++;
		this.cmd(act.createLabel, this.infoLabelID, '', INFO_MSG_X, INFO_MSG_Y, 0);

		this.cmd(
			act.createLabel,
			this.nextIndex++,
			'Validated Adjacency List:',
			VISITED_START_X - 5,
			VISITED_START_Y - 25,
			0,
		);

		this.animationManager.setAllLayers([0, 32, this.currentLayer]);
		this.animationManager.startNewAnimation(this.commands);
		this.animationManager.skipForward();
		this.animationManager.clearHistory();
		this.lastIndex = this.nextIndex;
	}

	startCallback() {
		if (this.listField.value !== '') {
			const adjacencyList = this.listField.value.split("\n").map((line) => {
				const [node, neighbors] = line.split("->");
				return { node, neighbors: neighbors.split(",").map((n) => n.trim()) };
			  });
			console.log("Parsed Adjacency List: ", adjacencyList);
		} else {
			this.shake(this.runButton);
		}
	}
}