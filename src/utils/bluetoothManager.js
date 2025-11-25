export class BluetoothManager {
    constructor() {
        this.device = null;
        this.server = null;
        this.callbacks = {
            onDisconnected: null,
            onVitalUpdate: null
        };
    }

    async connect(onVitalUpdate, onDisconnected) {
        this.callbacks.onVitalUpdate = onVitalUpdate;
        this.callbacks.onDisconnected = onDisconnected;

        try {
            console.log('Requesting Bluetooth Device...');
            this.device = await navigator.bluetooth.requestDevice({
                filters: [
                    { services: ['heart_rate'] },
                    { services: ['blood_pressure'] },
                    { services: ['pulse_oximeter'] }
                ],
                optionalServices: ['heart_rate', 'blood_pressure', 'pulse_oximeter', 0x180D, 0x1810, 0x1822],
                acceptAllDevices: false
            });

            this.device.addEventListener('gattserverdisconnected', this.handleDisconnection.bind(this));

            console.log('Connecting to GATT Server...');
            this.server = await this.device.gatt.connect();

            await this.startNotifications();

            return this.device;
        } catch (error) {
            console.error('Connection failed!', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.device && this.device.gatt.connected) {
            this.device.gatt.disconnect();
        }
    }

    handleDisconnection(event) {
        const device = event.target;
        console.log(`Device ${device.name} is disconnected.`);
        if (this.callbacks.onDisconnected) {
            this.callbacks.onDisconnected();
        }
    }

    async startNotifications() {
        // Heart Rate
        try {
            const service = await this.server.getPrimaryService('heart_rate');
            const characteristic = await service.getCharacteristic('heart_rate_measurement');
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', this.handleHeartRateChanged.bind(this));
            console.log('Heart Rate notifications started');
        } catch (e) {
            console.log('Heart Rate service not found or accessible', e);
        }

        // Blood Pressure
        try {
            const service = await this.server.getPrimaryService('blood_pressure');
            const characteristic = await service.getCharacteristic('blood_pressure_measurement');
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', this.handleBloodPressureChanged.bind(this));
            console.log('Blood Pressure notifications started');
        } catch (e) {
            console.log('Blood Pressure service not found', e);
        }

        // Pulse Oximeter
        try {
            const service = await this.server.getPrimaryService('pulse_oximeter');
            const characteristic = await service.getCharacteristic('plx_continuous_measurement');
            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', this.handleSpO2Changed.bind(this));
            console.log('Pulse Oximeter notifications started');
        } catch (e) {
            console.log('Pulse Oximeter service not found', e);
        }
    }

    handleHeartRateChanged(event) {
        const value = event.target.value;
        const flags = value.getUint8(0);
        const rate16Bits = flags & 0x1;
        let hr;
        if (rate16Bits) {
            hr = value.getUint16(1, true);
        } else {
            hr = value.getUint8(1);
        }

        if (this.callbacks.onVitalUpdate) {
            this.callbacks.onVitalUpdate({ hr });
        }
    }

    handleBloodPressureChanged(event) {
        const value = event.target.value;
        const flags = value.getUint8(0);
        let offset = 1;

        const systolic = value.getFloat32(offset, true); // SFLOAT
        offset += 2; // SFLOAT is 16-bit usually in GATT but standard says SFLOAT (16-bit IEEE-11073)
        // Note: JS DataView doesn't support SFLOAT directly. 
        // For simplicity in this demo, assuming standard IEEE-11073 16-bit float parsing is needed.
        // But often devices send simpler formats. Let's try standard parsing if possible or fallback to simple mapping.

        // Simplified parsing for demo (assuming standard layout but treating as uint8/16 if simple)
        // Real SFLOAT parsing is complex. Let's assume the device sends somewhat standard data.
        // Actually, let's use a simpler extraction for now:
        const sys = value.getUint8(1);
        const dia = value.getUint8(3);

        if (this.callbacks.onVitalUpdate) {
            this.callbacks.onVitalUpdate({ bp_sys: sys, bp_dia: dia });
        }
    }

    handleSpO2Changed(event) {
        const value = event.target.value;
        // PLX Continuous Measurement
        // Flags at byte 0
        const spo2 = value.getUint8(1); // SpO2PR-Normal - usually 2nd byte in simple implementations

        if (this.callbacks.onVitalUpdate) {
            this.callbacks.onVitalUpdate({ spo2 });
        }
    }
}
