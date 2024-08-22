import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList, Image } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Audio, AVPlaybackStatus } from 'expo-av';
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

const ImagePickerSection: React.FC<{ imageUri: string | null, onImagePick: () => void, onImageDelete: () => void }> = ({ imageUri, onImagePick, onImageDelete }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }}>
        {imageUri ? (
            <View style={{ position: 'relative' }}>
                <Image source={{ uri: imageUri }} style={styles.image} />
                <TouchableOpacity style={[styles.commonIconButton, styles.deleteIconButton]} onPress={onImageDelete}>
                    <Image style={styles.deleteIconImage} source={require('../../assets/images/delete.png')} />
                </TouchableOpacity>
            </View>
        ) : (
            <TouchableOpacity style={[styles.commonIconButton, styles.iconButton]} onPress={onImagePick}>
                <Image style={styles.iconImage} source={require('../../assets/images/camera.png')} />
            </TouchableOpacity>
        )}
    </View>
);

const CreateEncounter: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDatePickerVisible, setDatePickerVisible] = useState<boolean>(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState<boolean>(false);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [soundUri, setSoundUri] = useState<string | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null)

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
        if (currentStep === 3) {
            handleSubmit(); // Submit the form if it's the last step
        } else {
            setCurrentStep(prevStep => prevStep + 1); // Go to the next step
        }
    };

    const goToPreviousStep = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };

    const handleCameraButton = async () => {
        // Request camera permissions
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
            return;
        }

        // Launch the camera
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets?.length > 0) {
            setImageUri(result.assets[0].uri);
        } else {
            console.log('User cancelled photo picker');
        }
    };

    const handleDeleteImageButton = () => {
        setImageUri(null);
    };

    const startRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'We need microphone access to record audio.');
                return;
            }

            // Setting up recording options
            const recordingOptions = Audio.RecordingOptionsPresets.HIGH_QUALITY;

            // Start recording
            const { recording } = await Audio.Recording.createAsync(recordingOptions);
            setRecording(recording);
            console.log('Recording started');
        } catch (error) {
            console.error('Error starting recording:', error);
            Alert.alert('Error', 'Unable to start recording');
        }
    };

    const stopRecording = async () => {
        try {
            if (recording) {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                setSoundUri(uri);
                setRecording(null);
                console.log('Recording stopped', uri);
            }
        } catch (error) {
            console.error('Error stopping recording:', error);
            Alert.alert('Error', 'Unable to stop recording');
        }
    };

    const playSound = async () => {
        if (soundUri) {
            try {
                const { sound } = await Audio.Sound.createAsync({ uri: soundUri });
                setSound(sound);
                await sound.playAsync();
            } catch (error) {
                console.error('Error playing sound:', error);
                Alert.alert('Error', 'Unable to play the sound');
            }
        } else {
            Alert.alert('No Recording', 'There is no recording available to play.');
        }
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
                diagnoses: [],
                feeCode: '',
                charge: '',
                units: ''
            }}
            onSubmit={values => {
                Alert.alert("Form Submitted Successfully!");
            }}
        >
            {({ setFieldValue, handleSubmit, values }) => (
                <View style={styles.container}>
                    {currentStep === 1 && (
                        <>
                            <ImagePickerSection
                                imageUri={imageUri}
                                onImagePick={handleCameraButton}
                                onImageDelete={handleDeleteImageButton}
                            />
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
                            <View>
                                <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                                    <Text>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={playSound} disabled={!soundUri}>
                <Text>Play Recording</Text>
            </TouchableOpacity>
                            </View>
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
                            disabled={currentStep === 1}
                        >
                            <Text style={styles.buttonText}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => goToNextStep(handleSubmit)}
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
    image: {
        width: 150,
        height: 150,
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    diagnosisItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        marginHorizontal: 20,
    },
    diagnosisTextInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        padding: 10,
        marginRight: 10,
    },
    removeButton: {
        backgroundColor: '#dc3545',
        borderRadius: 5,
        paddingHorizontal: 12,
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
    commonIconButton: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d1d5db',
        padding: 10,
        width: 60,
        height: 60,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 10,
    },
    iconButton: {
        shadowColor: 'blue',
        marginHorizontal: 20,
    },
    deleteIconButton: {
        shadowColor: 'red',
        position: 'absolute',
        top: -20,
        right: -25,
    },
    iconImage: {
        width: 30,
        height: 30,
    },
    deleteIconImage: {
        width: 25,
        height: 25,
    },
});

export default CreateEncounter;
