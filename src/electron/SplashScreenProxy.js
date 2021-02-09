// Default parameter values including image size can be changed in `config.xml`
var splashImageWidth = 400;
var splashImageHeight = 500;
var splashScreenDelay = 3000; // in milliseconds
var showSplashScreen = true; // show splashcreen by default
var splashWin = null;
var cordova = require('cordova');
var configHelper = cordova.require('cordova/confighelper');
var electron = window.require('electron');
var path = require('path');

var SplashScreen = {
    setBGColor: function (cssBGColor) {

    },
    show: function () {
        splashWin = new electron.remote.BrowserWindow({
                width: splashImageWidth,
                height: splashImageHeight,
                center: true,
                frame: false,
                alwaysOnTop: true
            }
        );
        splashWin.loadURL(path.resolve(`${__dirname}/assets/splash.html`));
    },
    hide: function () {
        if (splashWin !== null) {
            electron.remote.getCurrentWindow().show();
            setTimeout(function () {
                splashWin.close();
                splashWin = null;
            }, 1500);
        }
    }
};

/**
 * Reads preferences via ConfigHelper and substitutes default parameters.
 */
function readPreferencesFromCfg(cfg) {
    try {
        var value = cfg.getPreferenceValue('ShowSplashScreen');
        if (typeof value != 'undefined') {
            showSplashScreen = value === 'true';
        }

        splashScreenDelay = cfg.getPreferenceValue('SplashScreenDelay') || splashScreenDelay;
        splashImageWidth = cfg.getPreferenceValue('SplashScreenWidth') || splashImageWidth;
        splashImageHeight = cfg.getPreferenceValue('SplashScreenHeight') || splashImageHeight;
    } catch (e) {
        var msg = '[Browser][SplashScreen] Error occured on loading preferences from config.xml: ' + JSON.stringify(e);
        console.error(msg);
    }
}

/**
 * Shows and hides splashscreen if it is enabled, with a delay according the current preferences.
 */
function showAndHide() {
    if (showSplashScreen) {
        SplashScreen.show();

        window.setTimeout(function () {
            SplashScreen.hide();
        }, splashScreenDelay);
    } else {
        electron.remote.getCurrentWindow().show();
    }
}

/**
 * Tries to read config.xml and override default properties and then shows and hides splashcreen if it is enabled.
 */
(function initAndShow() {
    configHelper.readConfig(function (config) {
        readPreferencesFromCfg(config);
        showAndHide();
    }, function (err) {
        console.error(err);
    });
})();

module.exports = SplashScreen;

require("cordova/exec/proxy").add("SplashScreen", SplashScreen);

