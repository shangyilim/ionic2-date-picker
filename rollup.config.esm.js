import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import angular from 'rollup-plugin-angular';
import typescript from 'rollup-plugin-typescript';
var sass = require('node-sass');
export default {
    entry: 'lib/date-picker.ts',
    format: 'es',
    moduleName: 'date-picker',
    sourceMap: true,
    external: [
        '@angular/common',
        '@angular/compiler',
        '@angular/compiler-cli',
        '@angular/core',
        '@angular/forms',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@ionic-native/core',
        '@ionic-native/splash-screen',
        '@ionic-native/status-bar',
        '@ionic/storage',
        'ionic-angular',
        'ionicons',
        'moment',
        'moment/src/moment',
        'rxjs',
        'sw-toolbox',
        'zone.js'
    ],
    dest: 'dist/date-picker.esm.js',
    plugins: [
        angular(
            {
                preprocessors: {
                    template: template => template,
                    style: scss => {
                        console.log('starting scss');
                        let css;
                        if (scss) {

                            console.log('scss found');
                            css = sass.renderSync({ data: scss }).css.toString();
                        } else {

                            console.log('scss not found');
                            css = '';
                        }
                        return css;
                    },
                }
            }
        ),
        typescript({
            typescript: require('typescript')
        }),
        resolve({
            module: true,
            main: true
        }),
        commonjs({
            include: 'node_modules/**',
        })
    ],
    onwarn: warning => {
        const skip_codes = [
            'THIS_IS_UNDEFINED',
            'MISSING_GLOBAL_NAME'
        ];
        if (skip_codes.indexOf(warning.code) != -1) return;
        console.error(warning);
    }
};