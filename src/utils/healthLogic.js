/**
 * Calculates the health status based on Age, Heart Rate, Blood Pressure, and SpO2.
 * 
 * @param {number} age - Patient's age
 * @param {number} hr - Heart Rate (bpm)
 * @param {number} sys - Systolic BP (mmHg)
 * @param {number} dia - Diastolic BP (mmHg)
 * @param {number} spo2 - Oxygen Saturation (%)
 * @returns {string} - 'normal', 'warning', or 'critical'
 */
export const calculateDetailedStatus = (age, hr, sys, dia, spo2) => {
    let hrStatus = 'normal';
    let bpStatus = 'normal';
    let spo2Status = 'normal';

    // 1. SpO2 Logic
    if (spo2 < 90) spo2Status = 'critical';
    else if (spo2 <= 94) spo2Status = 'warning';

    // 2. Blood Pressure Logic
    let bpRanges = {
        normal: { sys: [110, 120], dia: [70, 80] },
        warning: { sys: [121, 139], dia: [81, 89] },
        critical: { sys: 180, dia: 120 },
        lowCritical: { sys: 90, dia: 60 }
    };

    if (age >= 40 && age <= 59) {
        bpRanges.normal = { sys: [120, 130], dia: [75, 85] };
        bpRanges.warning = { sys: [131, 159], dia: [86, 99] };
    } else if (age >= 60 && age <= 79) {
        bpRanges.normal = { sys: [130, 140], dia: [80, 90] };
        bpRanges.warning = { sys: [141, 159], dia: [90, 99] };
    } else if (age >= 80) {
        bpRanges.normal = { sys: [135, 145], dia: [80, 90] };
        bpRanges.warning = { sys: [146, 159], dia: [90, 99] };
    }

    // Check BP Critical
    if (sys >= bpRanges.critical.sys || dia >= bpRanges.critical.dia || sys < bpRanges.lowCritical.sys || dia < bpRanges.lowCritical.dia) {
        bpStatus = 'critical';
    } else if (
        (sys >= bpRanges.warning.sys[0] && sys <= bpRanges.warning.sys[1]) ||
        (dia >= bpRanges.warning.dia[0] && dia <= bpRanges.warning.dia[1])
    ) {
        bpStatus = 'warning';
    }

    // 3. Heart Rate Logic
    let hrLimits = {
        warning: { min: 55, max: 100 },
        critical: { min: 40, max: 130 }
    };

    if (age >= 18 && age <= 30) {
        hrLimits.warning = { min: 55, max: 100 };
        hrLimits.critical = { min: 40, max: 130 };
    } else if (age >= 31 && age <= 45) {
        hrLimits.warning = { min: 55, max: 95 };
        hrLimits.critical = { min: 40, max: 130 };
    } else if (age >= 46 && age <= 60) {
        hrLimits.warning = { min: 50, max: 95 };
        hrLimits.critical = { min: 38, max: 130 };
    } else if (age >= 61 && age <= 75) {
        hrLimits.warning = { min: 48, max: 90 };
        hrLimits.critical = { min: 35, max: 130 };
    } else if (age >= 76) {
        hrLimits.warning = { min: 45, max: 85 };
        hrLimits.critical = { min: 32, max: 130 };
    }

    if (hr > hrLimits.critical.max || hr < hrLimits.critical.min) {
        hrStatus = 'critical';
    } else if (hr > hrLimits.warning.max || hr < hrLimits.warning.min) {
        hrStatus = 'warning';
    }

    // Overall Status
    let overallStatus = 'normal';
    if (hrStatus === 'critical' || bpStatus === 'critical' || spo2Status === 'critical') {
        overallStatus = 'critical';
    } else if (hrStatus === 'warning' || bpStatus === 'warning' || spo2Status === 'warning') {
        overallStatus = 'warning';
    }

    return { hrStatus, bpStatus, spo2Status, overallStatus };
};

export const calculateStatus = (age, hr, sys, dia, spo2) => {
    return calculateDetailedStatus(age, hr, sys, dia, spo2).overallStatus;
};
