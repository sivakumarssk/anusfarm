import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateSelector from '../components/DateSelector';
import CustomAlert from '../components/CustomAlert';
type ScheduleStatus = 'Scheduled' | 'Paused' | 'Skipped';

const EditScheduleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { order } = route.params;

  const product = order.products?.[0] || order.items?.[0] || null;

  const initialDate = order.deliveryDate
    ? new Date(order.deliveryDate)
    : new Date();

  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [pauseFrom, setPauseFrom] = useState<Date>(initialDate);
  const [pauseTo, setPauseTo] = useState<Date>(initialDate);
  const [activePauseField, setActivePauseField] =
    useState<'from' | 'to'>('from');

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showSkipModal, setShowSkipModal] = useState(false);

  const [scheduleStatus, setScheduleStatus] =
    useState<ScheduleStatus>('Scheduled');

  const [pausedFromText, setPausedFromText] = useState('');
  const [pausedToText, setPausedToText] = useState('');
  const [skippedDateText, setSkippedDateText] = useState('');
const [showValidationAlert, setShowValidationAlert] = useState(false);
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const productName =
    product?.product_name || product?.name || 'Subscription Order';

  const quantityText = product
    ? `${product.unit ? `${product.unit} | ` : ''}Qty ${product.quantity ?? 1}`
    : 'Scheduled Subscription';

  const total = order.totalAmount ?? order.total ?? product?.price ?? 0;

const confirmPause = () => {
  if (pauseFrom > pauseTo) {
    setShowValidationAlert(true);
    return;
  }

  setPausedFromText(formatDate(pauseFrom));
  setPausedToText(formatDate(pauseTo));
  setScheduleStatus('Paused');
  setShowPauseModal(false);
};

  const confirmSkip = () => {
    setSkippedDateText(formatDate(selectedDate));
    setScheduleStatus('Skipped');
    setShowSkipModal(false);
  };

  const resumeSchedule = () => {
    setScheduleStatus('Scheduled');
    setPausedFromText('');
    setPausedToText('');
    setSkippedDateText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={23} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Edit Schedule</Text>

        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Image
              source={require('../../assets/icons/notification.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require('../../assets/icons/wallet.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require('../../assets/icons/cart.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.month}>
        {selectedDate.toLocaleDateString('en-IN', {
          month: 'long',
          year: 'numeric',
        })}
      </Text>

      <DateSelector
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {product?.image ? (
            <Image
              source={{ uri: product.image }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <Ionicons name="calendar-outline" size={36} color="#777" />
          )}
        </View>

        <View style={styles.productDetails}>
          <Text style={styles.name}>{productName}</Text>
          <Text style={styles.info}>{quantityText}</Text>
          <Text style={styles.price}>₹{total}</Text>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                scheduleStatus === 'Paused' && styles.pausedDot,
                scheduleStatus === 'Skipped' && styles.skippedDot,
              ]}
            />
            <Text
              style={[
                styles.statusText,
                scheduleStatus === 'Paused' && styles.pausedText,
                scheduleStatus === 'Skipped' && styles.skippedText,
              ]}
            >
              {scheduleStatus}
            </Text>
          </View>

          {scheduleStatus === 'Paused' && (
            <Text style={styles.schedule}>
              From {pausedFromText}{'\n'}To {pausedToText}
            </Text>
          )}

          {scheduleStatus === 'Skipped' && (
            <Text style={styles.schedule}>
              Skipped on {skippedDateText}
            </Text>
          )}

          {scheduleStatus === 'Scheduled' && (
            <Text style={styles.schedule}>
              Scheduled {formatDate(selectedDate)}
            </Text>
          )}

          <View style={styles.buttonRow}>
            {scheduleStatus === 'Paused' ? (
              <TouchableOpacity
                style={[styles.button, styles.resumeButton]}
                onPress={resumeSchedule}
              >
                <Ionicons name="play" size={15} color="#FFF" />
                <Text style={styles.buttonText}>Resume</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setPauseFrom(selectedDate);
                    setPauseTo(selectedDate);
                    setActivePauseField('from');
                    setShowPauseModal(true);
                  }}
                >
                  <Text style={styles.buttonText}>Pause</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setSelectedDate(initialDate);
                    setShowSkipModal(true);
                  }}
                >
                  <Text style={styles.buttonText}>Skip</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>

      {/* PAUSE DATE RANGE POPUP */}
      <Modal
        visible={showPauseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPauseModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pause Schedule</Text>
              <TouchableOpacity onPress={() => setShowPauseModal(false)}>
                <Ionicons name="close" size={25} color="#222" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Select the dates for which you want to pause your subscription.
            </Text>

            <View style={styles.dateFields}>
              <TouchableOpacity
                style={[
                  styles.dateField,
                  activePauseField === 'from' && styles.activeDateField,
                ]}
                onPress={() => setActivePauseField('from')}
              >
                <Text style={styles.dateLabel}>From Date</Text>
                <Text style={styles.dateValue}>{formatDate(pauseFrom)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dateField,
                  activePauseField === 'to' && styles.activeDateField,
                ]}
                onPress={() => setActivePauseField('to')}
              >
                <Text style={styles.dateLabel}>To Date</Text>
                <Text style={styles.dateValue}>{formatDate(pauseTo)}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.chooseDateText}>
              Choose {activePauseField === 'from' ? 'From Date' : 'To Date'}
            </Text>

            <DateSelector
              selectedDate={activePauseField === 'from' ? pauseFrom : pauseTo}
              onSelectDate={(date: Date) => {
                if (activePauseField === 'from') {
                  setPauseFrom(date);
                } else {
                  setPauseTo(date);
                }
              }}
            />

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowPauseModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmPause}
              >
                <Text style={styles.buttonText}>Confirm Pause</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SKIP DATE POPUP */}
      <Modal
        visible={showSkipModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSkipModal(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Skip Delivery</Text>
              <TouchableOpacity onPress={() => setShowSkipModal(false)}>
                <Ionicons name="close" size={25} color="#222" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Choose the delivery date you want to skip.
            </Text>

            <View style={styles.selectedDateBox}>
              <Ionicons name="calendar-outline" size={22} color="#222" />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.dateLabel}>Selected Date</Text>
                <Text style={styles.dateValue}>
                  {formatDate(selectedDate)}
                </Text>
              </View>
            </View>

            <ScrollView style={styles.calendarArea}>
              <DateSelector
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </ScrollView>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowSkipModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmSkip}
              >
                <Text style={styles.buttonText}>Confirm Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CustomAlert
  visible={showValidationAlert}
  title="Invalid Date Range"
  message="To Date must be on or after From Date."
  buttonText="OK"
  onClose={() => setShowValidationAlert(false)}
/>
    </SafeAreaView>
  );
};

export default EditScheduleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginTop: 5,
    marginLeft: 10,
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 12,
  },
  month: {
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 2,
    fontSize: 18,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    backgroundColor: '#F5F5F5',
    height: 140,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontFamily: 'Inter-Medium',
    fontSize: 17,
  },
  info: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#777',
    marginTop: 3,
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginTop: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#269653',
    marginRight: 6,
  },
  pausedDot: {
    backgroundColor: '#D18B00',
  },
  skippedDot: {
    backgroundColor: '#D94343',
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#269653',
  },
  pausedText: {
    color: '#B87900',
  },
  skippedText: {
    color: '#D94343',
  },
  schedule: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#000',
    minHeight: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    flexDirection: 'row',
    gap: 5,
  },
  resumeButton: {
    backgroundColor: '#269653',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    fontSize: 13,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 430,
    maxHeight: '90%',
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 21,
    color: '#111',
  },
  modalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    lineHeight: 20,
    color: '#666',
    marginTop: 10,
    marginBottom: 16,
  },
  dateFields: {
    flexDirection: 'row',
    gap: 10,
  },
  dateField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 12,
  },
  activeDateField: {
    borderColor: '#111',
    backgroundColor: '#F7F7F7',
  },
  dateLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#777',
  },
  dateValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#111',
    marginTop: 5,
  },
  chooseDateText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginTop: 18,
    marginBottom: 8,
  },
  selectedDateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  calendarArea: {
    maxHeight: 180,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    height: 46,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#222',
    fontSize: 14,
  },
  confirmButton: {
    flex: 1.4,
    height: 46,
    backgroundColor: '#000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});