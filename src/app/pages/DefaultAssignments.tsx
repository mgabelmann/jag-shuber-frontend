import * as React from 'react';
import {
    Well
} from 'react-bootstrap';
import AssignmentAddModal from '../containers/AssignmentAddModal';
import AssignmentTemplateList from '../containers/AssignmentTemplateList';

class DefaultAssignments extends React.PureComponent {
    render() {
        return (

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Well style={{ display: "flex", backgroundColor: 'white', flexDirection: "column", flex: "1 1", maxWidth: "80%", minWidth: 800 }}>
                    <div style={{ flex: "1", alignSelf: "center", paddingBottom: 15 }}>
                        <h1>Manage Default Assignments</h1>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <AssignmentAddModal isDefaultTemplate />
                    </div> <br/>
                    <AssignmentTemplateList />
                   
                </Well>
            </div>
        );
    }
}

export default DefaultAssignments;


