import * as React from 'react'
import {
    ListGroup,
    ListGroupItem
} from 'react-bootstrap'
import AssignmentCard from './AssignmentCard'
import { SheriffAssignment } from '../api/index';

export interface AssignmentListProps {
    assignments: SheriffAssignment[];
    assignmentGroupId:number;
}

class AssignmentList extends  React.PureComponent<AssignmentListProps, any>{
    render() {
        const { assignments, assignmentGroupId } = this.props;
         return ( 
            <ListGroup>
                {assignments.map(t => (
                    <ListGroupItem key={t.id}>
                        <AssignmentCard assignment={t} currentGroupId={assignmentGroupId} />
                    </ListGroupItem>
                ))}
            </ListGroup>
        )
    }
}

export default AssignmentList