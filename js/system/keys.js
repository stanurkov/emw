


export default class KeyMapper {

    keyMap = [

        { key: "Ctrl+F1", command: "openNewWindow", where: "panel", when: ""},
        
    ];

    loadMap() {
        const keyDict = {};

        this.keyMap.forEach( key => {
            const keyName = key.key.toUpperCase();
            let mapping = keyDict[keyName];
            if (mapping) {
                mapping.push(key);
            } else {
                keyDict[keyName] = [ key ];
            }
        } );

        this.keyDict = keyDict;
    }

    eventToKey(event) {
        let keyName = event.key;

        if (keyName) {
            keyName = ((event.metaKey) ? "Meta+" : "") +
                    ((event.altKey) ? "Alt+" : "") +
                    ((event.ctrlKey) ? "Ctrl+" : "") + 
                    ((event.shiftKey) ? "Shift+" : "") + 
                    keyName;
            return keyName;
        } else return null;
    }


    mapKeyEvent( event, where, context ) {
        return this.mapKeyName(this.eventToKey(event), where, context);    
    }

    mapKeyName( keyName, where, context ) {
        if (!this.keyDict) {
            this.loadMap();
        }

        const mapping = this.keyDict[ keyName.toUpperCase() ];

        if (mapping) {
            const cmd = mapping.find( key => {
                if (where === key.where) {
                    if (key.when) {
                        if (context && typeof context === 'object') {
                            const {
                                fileSelected,
                                dirSelected,
                                commandLine,
                            } = context;

                            return eval(key.when);
                        }
                        return eval(key.when);
                    } else {
                        return true;
                    }

                }
            } );
            return cmd;
        }
    }
}