import * as React from 'react';
import {
    Button,
    Glyphicon
} from 'react-bootstrap';
import ModalWrapper from './ModalWrapper';
import { connect } from 'react-redux';
import { deleteAssignmentTemplate } from '../modules/assignments/actions';

export interface AssignmentDeleteModalProps {
    templateId: number;
    deleteAssignment?: (id: number) => void;
}

class AssignmentDeleteModal extends React.Component<AssignmentDeleteModalProps>{
    render() {
        const { deleteAssignment, templateId } = this.props;
        return (
            <div>
                <ModalWrapper
                    title="Delete Assignment"
                    showButton={({ handleShow }) => <Button bsStyle="danger" bsSize="xsmall" onClick={() => handleShow()}><Glyphicon glyph="trash" /></Button>}
                    body={() => "Are you sure you want to delete this default assignment?"}
                    footerComponent={({ handleClose }) => <Button bsStyle="danger" onClick={() => {
                        deleteAssignment && deleteAssignment(templateId);
                        handleClose();
                    }}>Delete</Button>}
                />
            </div>
        );
    }
}

export default connect<{}, any, AssignmentDeleteModalProps>(null, { deleteAssignment: deleteAssignmentTemplate })(AssignmentDeleteModal)