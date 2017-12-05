/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

// Default parameter values including image size can be changed in `config.xml`
var splashImageWidth = 400;
var splashImageHeight = 500;
var splashScreenDelay = 3000; // in milliseconds
var showSplashScreen = true; // show splashcreen by default
var splashWin = null;
var cordova = require('cordova');
var configHelper = cordova.require('cordova/confighelper');
var gui;

var SplashScreen = {
    setBGColor: function (cssBGColor) {

    },
    show: function () {
      gui = window.require('nw.gui');
      gui.Window.open('./splash.html', {
        'icon': 'icon.png',
        'transparent': true,
        'frame': false,
        'position': 'center',
        'width': splashImageWidth,
        'height': splashImageHeight,
        'resizable': false,
        'fullscreen': false
      }, function (win) {
        splashWin = win;
      });
    },
    hide: function () {
      if (splashWin !== null) {
        splashWin.close(true);
        gui.Window.get().show();
        splashWin = null;
      }
    }
};

/**
 * Reads preferences via ConfigHelper and substitutes default parameters.
 */
function readPreferencesFromCfg(cfg) {
    try {
        var value = cfg.getPreferenceValue('ShowSplashScreen');
        if(typeof value != 'undefined') {
            showSplashScreen = value === 'true';
        }

        splashScreenDelay = cfg.getPreferenceValue('SplashScreenDelay') || splashScreenDelay;
        splashImageWidth = cfg.getPreferenceValue('SplashScreenWidth') || splashImageWidth;
        splashImageHeight = cfg.getPreferenceValue('SplashScreenHeight') || splashImageHeight;
    } catch(e) {
        var msg = '[Browser][SplashScreen] Error occured on loading preferences from config.xml: ' + JSON.stringify(e);
        console.error(msg);
    }
}

/**
 * Shows and hides splashscreen if it is enabled, with a delay according the current preferences.
 */
function showAndHide() {
    if(showSplashScreen) {
        SplashScreen.show();

        window.setTimeout(function() {
            SplashScreen.hide();
        }, splashScreenDelay);
    } else {
      gui.Window.get().show();
    }
}

/**
 * Tries to read config.xml and override default properties and then shows and hides splashcreen if it is enabled.
 */
(function initAndShow() {
    configHelper.readConfig(function(config) {
        readPreferencesFromCfg(config);
        showAndHide();
    }, function(err) {
        console.error(err);
    });
})();

module.exports = SplashScreen;

require("cordova/exec/proxy").add("SplashScreen", SplashScreen);

