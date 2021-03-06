import * as React from 'react';
import { SheriffTraining } from '../api/index';
import {
    Table,
    Glyphicon
} from 'react-bootstrap';
import DateDisplay from './DateDisplay';

export interface SheriffTrainingDetailsProps {
    training: SheriffTraining[];
    isCompactView?: boolean;
}

export default class SheriffTrainingDetails extends React.Component<SheriffTrainingDetailsProps, any>{
   trainingStatusStyle():string { 
        return "text-success";
    }
    
    render() {
        const { training = [], isCompactView = false} = this.props;
        return (
            <div>
                <h3>Training</h3>
                { training.length > 0 && (
                    <Table responsive>
                        <thead>
                            <tr >
                                <th className="text-left">Type</th>
                                { !isCompactView && <th className="text-left">Cert</th>}
                                { !isCompactView && <th className="text-left">Expiry</th>}
                                <th className="text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                        {training.map(function (training, index) {
                        return (
                                <tr key={index}>
                                    <td>{training.trainingType}</td>
                                    { !isCompactView && <td><DateDisplay date={training.certificationDate} showMonth showDay showYear/></td>}
                                    { !isCompactView && <td><DateDisplay date={training.expiryDate} showMonth showDay showYear/></td>}
                                    <td><Glyphicon glyph="ok" className="text-success" /></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table> )}
                {  training.length == 0 && (
                    <span className="text-danger">No training recorded. </span>
                )}
            </div>
        );
    }
}