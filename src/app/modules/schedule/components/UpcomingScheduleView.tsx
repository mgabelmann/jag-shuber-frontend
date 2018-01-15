import * as React from 'react';
import { 
    Table
} from 'react-bootstrap';

export interface UpcomingScheduleViewProps {
    
}

export default class UpcomingScheduleView extends React.Component<UpcomingScheduleViewProps, any>{
    render() {
        
        return (
            <div>
                <h3>Schedule</h3>
                <strong className="text-success">On Duty Now</strong> - Off duty at 7:00 PM 
                
                <Table responsive>
                    <thead>
                        <tr>
                            <th className="text-left">Day</th>
                            <th className="text-left">Shift</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sun Jan 28 2018</td>
                            <td>7AM to 7PM </td>
                        </tr>
                        <tr>
                            <td>Mon Jan 29 2018</td>
                            <td>7AM to 7PM </td>
                        </tr>
                        <tr>
                            <td>Tues Jan 30 2018</td>
                            <td>7AM to 7PM </td>
                        </tr>
                        <tr>
                            <td>Wed Jan 31 2018</td>
                            <td>7AM to 7PM </td>
                        </tr>
                        <tr>
                            <td>Thur Feb 01 2018</td>
                            <td>7AM to 7PM </td>
                        </tr>
                        <tr>
                            <td>Fri Feb 02 2018</td>
                            <td>7AM to 7PM </td>
                        </tr>
                        <tr>
                            <td>Sat Feb 03 2018</td>
                            <td>7AM to 7PM </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }
}