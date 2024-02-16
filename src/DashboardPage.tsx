import React, { ReactElement, useEffect, useState } from 'react';
import { Switch } from "@mui/material";
import './dashboard.scss';
import { CallMade, CallReceived } from "@mui/icons-material";
import { LineChart } from '@mui/x-charts/LineChart';
import { useInterval } from "./hooks/use-interval-hook";
import { toast } from "react-toastify";

const INTERVAL_MS = 1000;
const GLUCOSE_LOW = 90;
const GLUCOSE_HIGH = 150;
const GLUCOSE_MAX = 500;
const VARIANCE = 10;

enum MSG_TYPE {
    WARN = 'WARN',
    ERROR = 'ERR'
}


export function DashboardPage(): ReactElement {
    const [currentMeasurement, setCurrentMeasurement] = useState<number>(211);
    const [isTrendRising, setIsTrendRising] = useState<boolean>(false);
    const [data, setData] = useState<number[]>([]);
    const [labels, setLabels] = useState<number[]>([]);
    const [useAlerting, setUseAlerting] = useState<boolean>(false);
    const [high, setHigh] = useState<number[]>([]);
    const [low, setLow] = useState<number[]>([]);

    useInterval(readSensorData, INTERVAL_MS);

    useEffect(() => {
        setTrend();
        alertMe();
    }, [data]);

    /**
     * Reads the current value from the sensor.
     */
    function readSensorData(): void {
        let rands: number[];
        let labs: number[];

        if (data.length > 10) {
            rands = [data[data.length - 1]];
            setLow([GLUCOSE_LOW]);
            setHigh([GLUCOSE_HIGH]);
        } else {
            rands = [...data];
            setLow([...low, GLUCOSE_LOW]);
            setHigh([...high, GLUCOSE_HIGH]);
        }
        if (labels.length > 10) {
            labs = [labels[labels.length - 1]];
        } else {
            labs = [...labels];
        }

        rands.push(Math.floor(Math.random() * ((GLUCOSE_HIGH + VARIANCE) - (GLUCOSE_LOW - VARIANCE) + 1) + (GLUCOSE_LOW - VARIANCE)));
        if (labs.length > 0) {
            labs.push(labs[labs.length - 1] + INTERVAL_MS / 1000);
        } else {
            labs.push(0);
        }
        setCurrentMeasurement(rands[rands.length - 1]);
        setData(rands);
        setLabels(labs);
    }

    /**
     * Checks whether the current curve is rising or descending and sets the value.
     * The icon in the UI is shown respectively (arrow up or arrow down).
     */
    function setTrend(): void {
        // get last three diffs
        if (data.length > 2) {
            setIsTrendRising(data[data.length - 1] - data[data.length - 2] > 0);
        }
    }

    /**
     * This function checks the current glucose measurement against lower and upper thresholds
     * and alerts the current user, if action has to be taken.
     */
    function alertMe(): void {
        // check, if there has already been some measurements
        if (data.length > 0 && useAlerting === true) {
            const lastMeasurement = data[data.length - 1];
            if (lastMeasurement < GLUCOSE_LOW) {
                sendAlert('Achtung, der Blutzuckerspiegel ist zu niedrig!', MSG_TYPE.WARN);
            } else if (lastMeasurement > GLUCOSE_HIGH) {
                sendAlert('Achtung, der Blutzuckerspiegel ist zu hoch!', MSG_TYPE.ERROR);
            } else if (lastMeasurement > GLUCOSE_MAX) {
                sendAlert('Achtung, maximaler Blutzuckerspiegel erreicht!', MSG_TYPE.ERROR);
            }
        }
    }

    /**
     * This functions sends a specific alert to the user.
     * @param msg the message inside the alert.
     * @param type the type of the alert.
     */
    function sendAlert(msg: string, type: MSG_TYPE): void {
        if (type === MSG_TYPE.WARN) {
            toast.warn(msg, {position: "bottom-center", autoClose: INTERVAL_MS});
        } else {
            toast.error(msg, {position: "bottom-center", autoClose: INTERVAL_MS});
        }
    }

    return (
        <>
            <div className='w-100 current-value-container d-flex flex-column align-items-center p-5 gap-2'>
                <h6>aktuelle Blutzuckerkonzentration</h6>
                <div className='d-flex align-items-center'>
                <h1 className='robo-font'>{`${currentMeasurement} mg/dL`}</h1>
                {isTrendRising ? <CallMade className='pb-1' sx={{fontSize: 40}}/> :
                    <CallReceived className='pb-1' sx={{fontSize: 40}}/>}
                </div>
            </div>

            <div className='container d-flex flex-column align-items-center pt-2'>
                <LineChart
                    xAxis={[{
                        data: labels,
                        label: '[s]'
                    }]}
                    series={[
                        {
                            curve: "monotoneX",
                            data: data,
                            label: 'aktueller Wert [mg/dL]'
                        },
                        {
                            data: low,
                            area: true,
                            showMark: false,
                            label: 'Niedrig [mg/dL]'
                        },
                        {
                            data: high,
                            showMark: false,
                            label: 'Hoch [mg/dL]'
                        },
                    ]}
                    margin={{ left: 60, top: 100, right: 20 }}
                    width={450}
                    height={400}
                />

                <span className='mt-5'>Warnmeldungen über hohe und niedrige Werte</span>
                <div className='d-flex align-items-center'>
                    <span>aus</span>
                    <Switch value={useAlerting}
                            className='mb-1'
                            onChange={() => setUseAlerting(!useAlerting)}/>
                    <span>ein</span>
                </div>
            </div>
        </>)
}