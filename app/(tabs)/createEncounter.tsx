import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';

import { visitCategory, facilities, sensitivity } from '../../utils/common';

interface FormValues {
    selectedVisitCategory: string;
    selectedFacility: string;
    selectedBillingFacility: string;
    selectedDate: Date | null;
    selectedSensitivity: string;
    note: string;
    transcribedNote: string;
    diagnoses: string[];
    feeCode: string;
    charge: string;
    units: string;
}

const DateTimePickerComponent: React.FC<{
    mode: 'date' | 'time';
    value: Date | null;
    onChange: (event: any, date: Date | undefined) => void;
}> = ({ mode, value, onChange }) => (
    <DateTimePicker
        value={value || new Date()}
        mode={mode}
        display="default"
        onChange={onChange}
    />
);

const DropDown: React.FC<{
    title: string;
    placeholder: string;
    items: { label: string; value: string }[];
    value: string;
    onValueChange: (value: string) => void;
}> = ({ title, placeholder, items, value, onValueChange }) => (
    <>
        <Text style={styles.dropDownTitle}>{title}</Text>
        <View style={styles.dropDown}>
            <RNPickerSelect
                placeholder={{ label: placeholder, value: '' }}
                items={items}
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    </>
);

const CreateEncounter: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(1);

    const handleDateChange = (
        event: any,
        date: Date | undefined,
        setFieldValue: FormikHelpers<FormValues>['setFieldValue']
    ) => {
        setDatePickerVisible(false);
        if (date) {
            setSelectedDate(prevDate => {
                const updatedDate = prevDate ? new Date(prevDate) : new Date();
                updatedDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                return updatedDate;
            });
            setFieldValue('selectedDate', date);
            setTimePickerVisible(true);
        }
    };

    const handleTimeChange = (
        event: any,
        time: Date | undefined,
        setFieldValue: FormikHelpers<FormValues>['setFieldValue']
    ) => {
        setTimePickerVisible(false);
        if (time && selectedDate) {
            const updatedDate = new Date(selectedDate);
            updatedDate.setHours(time.getHours());
            updatedDate.setMinutes(time.getMinutes());
            setFieldValue('selectedDate', updatedDate);
            setSelectedDate(updatedDate);
        }
    };

    const goToNextStep = (handleSubmit: () => void) => {
        console.log('Current step:', currentStep); // Debugging statement
        if (currentStep === 3) {
            console.log('Submitting form...'); // Debugging statement
            handleSubmit(); // Submit the form if it's the last step
        } else {
            setCurrentStep(prevStep => prevStep + 1); // Go to the next step
        }
    };

    const goToPreviousStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    return (
        <Formik
            initialValues={{
                selectedVisitCategory: '',
                selectedFacility: '',
                selectedBillingFacility: '',
                selectedDate: null,
                selectedSensitivity: '',
                note: '',
                transcribedNote: '',
                diagnoses: [], // Correctly typed as an empty array of strings
                feeCode: '',
                charge: '',
                units: ''
            }}
            onSubmit={values => {
                console.log('Form submitted:', values);
                Alert.alert("Form Submitted Successfully!");
            }}
        >
            {({ setFieldValue, handleSubmit, values }) => (
                <View style={styles.container}>
                    {currentStep === 1 && (
                        <>
                            <DropDown
                                title="Visit Category"
                                placeholder="Select Category"
                                items={visitCategory}
                                value={values.selectedVisitCategory}
                                onValueChange={(value) => setFieldValue('selectedVisitCategory', value)}
                            />
                            <DropDown
                                title="Facility"
                                placeholder="Select Facility"
                                items={facilities}
                                value={values.selectedFacility}
                                onValueChange={(value) => setFieldValue('selectedFacility', value)}
                            />
                            <DropDown
                                title="Billing Facility"
                                placeholder="Select Billing Facility"
                                items={facilities}
                                value={values.selectedBillingFacility}
                                onValueChange={(value) => setFieldValue('selectedBillingFacility', value)}
                            />
                            <Text style={styles.dropDownTitle}>Date of Service</Text>
                            <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.datePickerButton}>
                                <Text style={styles.datePickerText}>
                                    {selectedDate ? selectedDate.toLocaleString() : 'Select Date & Time'}
                                </Text>
                            </TouchableOpacity>

                            {isDatePickerVisible && (
                                <DateTimePickerComponent
                                    mode="date"
                                    value={selectedDate}
                                    onChange={(event, date) => handleDateChange(event, date, setFieldValue)}
                                />
                            )}

                            {isTimePickerVisible && (
                                <DateTimePickerComponent
                                    mode="time"
                                    value={selectedDate}
                                    onChange={(event, time) => handleTimeChange(event, time, setFieldValue)}
                                />
                            )}

                            <DropDown
                                title="Sensitivity"
                                placeholder="Select Sensitivity"
                                items={sensitivity}
                                value={values.selectedSensitivity}
                                onValueChange={(value) => setFieldValue('selectedSensitivity', value)}
                            />
                        </>
                    )}
                    {currentStep === 2 && (
                        <View>
                            <Text style={styles.dropDownTitle}>Short notes</Text>
                            <TextInput
                                multiline
                                style={styles.textInput}
                                numberOfLines={10}
                                value={values.note}
                                onChangeText={(text) => setFieldValue('note', text)}
                            />
                            <Text style={styles.dropDownTitle}>Transcribe notes</Text>
                            <TextInput
                                multiline
                                style={styles.textInput}
                                numberOfLines={10}
                                value={values.transcribedNote}
                                editable={false}
                            />
                        </View>
                    )}
                    {currentStep === 3 && (
                        <View>
                            <Text style={styles.dropDownTitle}>Diagnoses</Text>
                            <FlatList
                                data={values.diagnoses}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={styles.diagnosisItem}>
                                        <TextInput
                                            style={styles.diagnosisTextInput}
                                            value={item}
                                            onChangeText={(text) => {
                                                const updatedDiagnoses: string[] = [...values.diagnoses];
                                                updatedDiagnoses[index] = text;
                                                setFieldValue('diagnoses', updatedDiagnoses);
                                            }}
                                        />
                                        <View style={styles.diagnosisButtonContainer}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    const updatedDiagnoses: string[] = values.diagnoses.filter((_, i) => i !== index);
                                                    setFieldValue('diagnoses', updatedDiagnoses);
                                                }}
                                                style={styles.removeButton}
                                            >
                                                <Text style={styles.diagnosisButtonText}>-</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => setFieldValue('diagnoses', [...values.diagnoses, ''])}
                                                style={styles.addButton}
                                            >
                                                <Text style={styles.diagnosisButtonText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />
                            <Text style={styles.dropDownTitle}>Fee Code</Text>
                            <TextInput
                                style={styles.dropDown}
                                value={values.feeCode}
                                onChangeText={(text) => setFieldValue('feeCode', text)}
                            />
                            <Text style={styles.dropDownTitle}>Charge (CAD - $)</Text>
                            <TextInput
                                style={styles.dropDown}
                                value={values.charge}
                                onChangeText={(text) => setFieldValue('charge', text)}
                            />
                            <Text style={styles.dropDownTitle}>Units</Text>
                            <TextInput
                                style={styles.dropDown}
                                value={values.units}
                                onChangeText={(text) => setFieldValue('units', text)}
                            />
                        </View>
                    )}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={goToPreviousStep}
                            style={[styles.button, styles.previousButton]}
                        >
                            <Text style={styles.buttonText}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                console.log('Next step button pressed');
                                goToNextStep(handleSubmit);
                            }}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>{currentStep === 3 ? 'Submit' : 'Next'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Formik>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    dropDown: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    dropDownTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        marginHorizontal: 20,
        marginVertical: 5,
    },
    datePickerButton: {
        paddingVertical: 10,
        marginHorizontal: 20,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginBottom: 20,
    },
    datePickerText: {
        fontSize: 16,
        textAlign: 'center',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10,
        height: 100,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#007bff',
        paddingVertical: 10,
        borderRadius: 5,
        flex: 1,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    previousButton: {
        backgroundColor: '#6c757d',
        marginRight: 10,
    },
    diagnosisButtonContainer: {
        flexDirection: "row",
        alignItems: 'center'
    },
    diagnosisItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 20,
    },
    diagnosisTextInput: {
        flex: 1, // Takes up remaining space
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        padding: 10,
        marginRight: 10, // Adds space between input and button
    },
    removeButton: {
        backgroundColor: '#dc3545',
        borderRadius: 5,
        paddingHorizontal: 12
    },
    addButton: {
        backgroundColor: '#28a745',
        borderRadius: 5,
        paddingHorizontal: 12,
        marginHorizontal: 20,
    },
    diagnosisButtonText: {
        color: 'white',
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CreateEncounter;
