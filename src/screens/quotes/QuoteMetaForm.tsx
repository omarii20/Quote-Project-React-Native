import React, {
  useState,
} from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {useTheme} from '../../context/ThemeContext';

type Props = {
  validUntil: Date | null;
  notes: string;

  onChangeValidUntil: (
    value: Date,
  ) => void;

  onChangeNotes: (
    value: string,
  ) => void;
};

export default function QuoteMetaForm({
  validUntil,
  notes,
  onChangeValidUntil,
  onChangeNotes,
}: Props) {
  const {colors} = useTheme();

  const [
    showDatePicker,
    setShowDatePicker,
  ] = useState(false);

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (
      event.type === 'set' &&
      selectedDate
    ) {
      onChangeValidUntil(
        selectedDate,
      );
    }
  };

  const formatDate = (
    date: Date,
  ) => {
    return date.toLocaleDateString(
      'he-IL',
    );
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.sectionTitle,
          {color: colors.textPrimary},
        ]}>
        פרטים נוספים
      </Text>

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        תוקף ההצעה
      </Text>

      <TouchableOpacity
        style={[
          styles.dateButton,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
        activeOpacity={0.8}
        onPress={() =>
          setShowDatePicker(true)
        }>
        <Text
          style={[
            styles.dateText,
            {
              color: validUntil
                ? colors.textPrimary
                : colors.textSecondary,
            },
          ]}>
          {validUntil
            ? formatDate(validUntil)
            : 'בחר תאריך'}
        </Text>

        <Text style={styles.calendarIcon}>
          📅
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={
            validUntil ?? new Date()
          }
          mode="date"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      <Text
        style={[
          styles.label,
          {color: colors.textPrimary},
        ]}>
        הערות
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.notesInput,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.textPrimary,
          },
        ]}
        value={notes}
        onChangeText={
          onChangeNotes
        }
        placeholder="הערות להצעת המחיר"
        placeholderTextColor={
          colors.textSecondary
        }
        multiline
        textAlign="right"
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 28,
  },

  sectionTitle: {
    marginBottom: 14,
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'right',
  },

  label: {
    marginTop: 14,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },

  dateButton: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateText: {
    fontSize: 15,
  },

  calendarIcon: {
    fontSize: 18,
  },

  input: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
  },

  notesInput: {
    minHeight: 110,
    paddingTop: 14,
  },
});