import * as React from 'react';
import { default as FormFieldWrapper, FormFieldWrapperProps } from './FormFieldWrapper';
import { FormControl } from 'react-bootstrap';


export default class NumberOfSheriffsSelector extends React.PureComponent<FormFieldWrapperProps>{
    render(){
        const { input:{value, onChange}, label} = this.props;
        return (
            <FormFieldWrapper {...this.props}>
                <FormControl componentClass="select" value={value} onChange={onChange}>
                    <option value="No Sheriffs Selected">{`Select ${label}`}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">4</option>
                </FormControl>
            </FormFieldWrapper>
        );
    }
}