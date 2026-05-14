-- ============================================
-- SAMPLE DATA FOR SCHOOL VAN MANAGEMENT SYSTEM
-- Corrected to match actual schema
-- ============================================

USE school_van_system;

-- ============================================
-- MODULE 6: DRIVERS & VEHICLES (Insert First)
-- ============================================

-- Insert Drivers
INSERT INTO drivers (driverId, firstName, lastName, licenseNumber, licenseExpiry, phone, email, assignedVanId, status) VALUES
('DRV001', 'John', 'Smith', 'DL123456', '2026-03-15', '0771234567', 'john.smith@email.com', 'VAN001', 'Active'),
('DRV002', 'Sarah', 'Johnson', 'DL234567', '2026-07-22', '0772345678', 'sarah.j@email.com', 'VAN002', 'Active'),
('DRV003', 'Michael', 'Brown', 'DL345678', '2025-11-30', '0773456789', 'michael.b@email.com', 'VAN003', 'Active'),
('DRV004', 'Emily', 'Davis', 'DL456789', '2027-05-18', '0774567890', 'emily.d@email.com', 'VAN004', 'Active'),
('DRV005', 'David', 'Wilson', 'DL567890', '2025-09-25', '0775678901', 'david.w@email.com', NULL, 'Inactive');

-- Insert Vehicles
INSERT INTO vehicles (vanId, registrationNumber, model, capacity, insuranceExpiry, lastServiceDate, nextServiceDate, assignedDriverId, status) VALUES
('VAN001', 'CAB-1234', 'Toyota Hiace', 15, '2025-06-30', '2024-02-15', '2024-05-15', 'DRV001', 'Active'),
('VAN002', 'CAB-2345', 'Nissan Caravan', 12, '2025-08-15', '2024-02-20', '2024-05-20', 'DRV002', 'Active'),
('VAN003', 'CAB-3456', 'Toyota Coaster', 20, '2025-12-31', '2024-02-10', '2024-05-10', 'DRV003', 'Active'),
('VAN004', 'CAB-4567', 'Mitsubishi Rosa', 18, '2025-04-20', '2024-02-25', '2024-05-25', 'DRV004', 'Active'),
('VAN005', 'CAB-5678', 'Toyota Hiace', 15, '2025-10-10', '2024-01-30', '2024-04-30', NULL, 'Maintenance');

-- ============================================
-- MODULE 1: ROUTES & SCHEDULES
-- ============================================

-- Insert Routes
INSERT INTO routes (routeId, routeName, vanId, isActive, currentGPS_latitude, currentGPS_longitude) VALUES
('R001', 'Colombo - Mount Lavinia Route', 'VAN001', true, 6.9271, 79.8612),
('R002', 'Kandy - Peradeniya Route', 'VAN002', true, 7.2906, 80.6337),
('R003', 'Galle - Hikkaduwa Route', 'VAN003', true, 6.0535, 80.2210),
('R004', 'Negombo - Katunayake Route', 'VAN004', true, 7.2098, 79.8358),
('R005', 'Matara - Weligama Route', 'VAN005', false, NULL, NULL);

-- Insert Schedules
INSERT INTO schedules (routeId, vanId, session, departureTime, arrivalTime, isActive, specialNotes) VALUES
(1, 'VAN001', 'morning', '06:30', '07:15', true, 'Pick up from Colombo Fort area'),
(1, 'VAN001', 'afternoon', '14:30', '15:15', true, 'Drop off at same locations'),
(2, 'VAN002', 'morning', '07:00', '07:30', true, 'Kandy city route'),
(2, 'VAN002', 'afternoon', '15:00', '15:30', true, 'Return route'),
(3, 'VAN003', 'morning', '06:45', '07:35', true, 'Coastal route'),
(3, 'VAN003', 'afternoon', '14:45', '15:35', true, 'Return via main road'),
(4, 'VAN004', 'morning', '07:15', '07:50', true, 'Airport area route'),
(4, 'VAN004', 'afternoon', '15:15', '15:50', true, 'Return route');

-- ============================================
-- MODULE 4: PARENTS & STUDENTS
-- ============================================

-- Insert Parents
INSERT INTO parents (firstName, lastName, phone, email, address, password, notificationEmail, notificationSMS) VALUES
('Robert', 'Anderson', '0711234567', 'robert.a@email.com', '12 School Lane, Colombo 03', 'password123', true, true),
('Jennifer', 'Martinez', '0712345678', 'jennifer.m@email.com', '45 Garden Road, Kandy', 'password123', true, true),
('William', 'Taylor', '0713456789', 'william.t@email.com', '78 Beach Street, Galle', 'password123', true, false),
('Patricia', 'Thomas', '0714567890', 'patricia.t@email.com', '23 Lake View, Negombo', 'password123', true, true),
('James', 'Garcia', '0715678901', 'james.g@email.com', '56 Hill Top, Matara', 'password123', false, true),
('Mary', 'Rodriguez', '0716789012', 'mary.r@email.com', '89 Park Avenue, Colombo 05', 'password123', true, true),
('Charles', 'Wilson', '0717890123', 'charles.w@email.com', '34 Main Street, Kandy', 'password123', true, true),
('Linda', 'Moore', '0718901234', 'linda.m@email.com', '67 Sea Road, Galle', 'password123', true, false);

-- Insert Students
INSERT INTO students (studentId, firstName, lastName, grade, dateOfBirth, assignedVanId, assignedRouteId, pickupAddress, isActive) VALUES
('STU001', 'Emma', 'Anderson', '5', '2014-04-12', 'VAN001', 1, '12 School Lane, Colombo 03', true),
('STU002', 'Liam', 'Martinez', '7', '2012-08-23', 'VAN002', 2, '45 Garden Road, Kandy', true),
('STU003', 'Olivia', 'Taylor', '6', '2013-11-05', 'VAN003', 3, '78 Beach Street, Galle', true),
('STU004', 'Noah', 'Thomas', '4', '2015-02-18', 'VAN004', 4, '23 Lake View, Negombo', true),
('STU005', 'Ava', 'Garcia', '8', '2011-06-30', 'VAN005', 5, '56 Hill Top, Matara', false),
('STU006', 'Sophia', 'Rodriguez', '5', '2014-09-14', 'VAN001', 1, '89 Park Avenue, Colombo 05', true),
('STU007', 'Mason', 'Wilson', '6', '2013-03-27', 'VAN002', 2, '34 Main Street, Kandy', true),
('STU008', 'Isabella', 'Moore', '7', '2012-12-08', 'VAN003', 3, '67 Sea Road, Galle', true);

-- Link Parents to Students
INSERT INTO parent_student_links (parentId, studentId, relationship, isPrimary) VALUES
(1, 1, 'Father', true),
(2, 2, 'Mother', true),
(3, 3, 'Father', true),
(4, 4, 'Mother', true),
(5, 5, 'Father', true),
(6, 6, 'Mother', true),
(7, 7, 'Father', true),
(8, 8, 'Mother', true);

-- Insert Emergency Contacts
INSERT INTO emergency_contacts (studentId, name, relationship, phone) VALUES
(1, 'Mary Anderson', 'Mother', '0719876543'),
(2, 'Carlos Martinez', 'Father', '0728765432'),
(3, 'Susan Taylor', 'Mother', '0737654321'),
(4, 'John Thomas', 'Father', '0746543210'),
(5, 'Maria Garcia', 'Mother', '0755432109'),
(6, 'Jose Rodriguez', 'Father', '0764321098'),
(7, 'Emma Wilson', 'Mother', '0773210987'),
(8, 'Robert Moore', 'Father', '0782109876');

-- ============================================
-- MODULE 3: ATTENDANCE & NOTIFICATIONS
-- ============================================

-- Insert Attendance Records
INSERT INTO attendance (studentId, routeId, date, session, status, markedBy, notes) VALUES
-- Today Morning
(1, 1, CURDATE(), 'morning', 'Picked Up', 'John Smith', 'On time'),
(2, 2, CURDATE(), 'morning', 'Picked Up', 'Sarah Johnson', 'On time'),
(3, 3, CURDATE(), 'morning', 'Absent', 'Michael Brown', 'Parent called - sick'),
(4, 4, CURDATE(), 'morning', 'Picked Up', 'Emily Davis', 'On time'),
(6, 1, CURDATE(), 'morning', 'Picked Up', 'John Smith', 'On time'),
(7, 2, CURDATE(), 'morning', 'Late', 'Sarah Johnson', 'Traffic delay'),
(8, 3, CURDATE(), 'morning', 'Picked Up', 'Michael Brown', 'On time'),
-- Yesterday
(1, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'morning', 'Picked Up', 'John Smith', 'On time'),
(2, 2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'morning', 'Picked Up', 'Sarah Johnson', 'On time'),
(3, 3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'morning', 'Picked Up', 'Michael Brown', 'On time'),
(4, 4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'morning', 'Picked Up', 'Emily Davis', 'On time');

-- Insert Notifications
INSERT INTO notifications (recipientId, type, title, message, priority, isRead) VALUES
(3, 'Attendance', 'Student Absent', 'Olivia was marked absent today. Please confirm.', 'High', false),
(7, 'Delay', 'Late Arrival', 'Mason arrived 20 minutes late today due to traffic.', 'Medium', false),
(1, 'General', 'School Event', 'Reminder: School event tomorrow at 9 AM', 'Low', true),
(2, 'Attendance', 'Perfect Attendance', 'Liam has perfect attendance this week!', 'Low', true);

-- ============================================
-- MODULE 2: EMERGENCY & SAFETY
-- ============================================

-- Insert SOS Alerts
INSERT INTO sos_alerts (alertId, vanId, driverId, routeId, latitude, longitude, status, description) VALUES
('SOS001', 'VAN001', 'DRV001', 'R001', 6.9271, 79.8612, 'Resolved', 'Minor accident - no injuries'),
('SOS002', 'VAN003', 'DRV003', 'R003', 6.0535, 80.2210, 'In Progress', 'Vehicle breakdown - waiting for assistance'),
('SOS003', 'VAN002', 'DRV002', 'R002', 7.2906, 80.6337, 'Resolved', 'Medical emergency - student feeling unwell');

-- Insert Incidents
INSERT INTO incidents (incidentId, vanId, driverId, type, severity, description, latitude, longitude, status) VALUES
('INC001', 'VAN001', 'DRV001', 'Accident', 'Low', 'Minor collision with parked vehicle. No injuries. Police report filed.', 6.9271, 79.8612, 'Resolved'),
('INC002', 'VAN004', 'DRV004', 'Breakdown', 'Medium', 'Engine overheating. Vehicle towed to garage.', 7.2098, 79.8358, 'Resolved'),
('INC003', 'VAN003', 'DRV003', 'Safety Concern', 'High', 'Student had allergic reaction. Taken to hospital, now stable.', 6.0535, 80.2210, 'Resolved');

-- Insert Broadcast Alerts
INSERT INTO broadcast_alerts (alertId, title, message, type, priority, targetAudience, createdBy) VALUES
('BRD001', 'School Closure Alert', 'School will be closed tomorrow due to weather conditions. All van services suspended.', 'Emergency Stop', 'High', 'All Parents', 'Admin'),
('BRD002', 'Route Change Notice', 'Route R001 will take alternate path due to road repairs. Expect 10 min delay.', 'Route Change', 'Medium', 'Specific Route', 'Admin'),
('BRD003', 'Safety Reminder', 'Please ensure students wear seatbelts at all times during transit.', 'General', 'Low', 'All Parents', 'Admin');

-- Insert Safety Checks
INSERT INTO safety_checks (checkId, vanId, driverId, brakes, tires, lights, fuel, firstAidKit, fireExtinguisher, overallStatus, notes) VALUES
('CHK001', 'VAN001', 'DRV001', true, true, true, true, true, true, 'Pass', 'All systems normal'),
('CHK002', 'VAN002', 'DRV002', true, true, false, true, true, true, 'Needs Attention', 'One brake light not working'),
('CHK003', 'VAN003', 'DRV003', true, true, true, true, true, true, 'Pass', 'All equipment present'),
('CHK004', 'VAN004', 'DRV004', false, true, true, true, true, true, 'Fail', 'Brake system needs immediate attention');

-- ============================================
-- MODULE 5: BILLING & PAYMENTS
-- ============================================

-- Insert Billing Records
INSERT INTO billing (billId, studentId, parentId, month, year, baseFee, attendancePercentage, calculatedFee, status, dueDate) VALUES
('BILL001', 1, 1, 'March', 2024, 5000.00, 100.00, 5000.00, 'Paid', '2024-03-31'),
('BILL002', 2, 2, 'March', 2024, 5000.00, 100.00, 5000.00, 'Paid', '2024-03-31'),
('BILL003', 3, 3, 'March', 2024, 5000.00, 85.00, 4250.00, 'Pending', '2024-03-31'),
('BILL004', 4, 4, 'March', 2024, 5000.00, 100.00, 5000.00, 'Paid', '2024-03-31'),
('BILL005', 5, 5, 'March', 2024, 5000.00, 75.00, 3750.00, 'Overdue', '2024-03-31'),
('BILL006', 6, 6, 'March', 2024, 5000.00, 100.00, 5000.00, 'Paid', '2024-03-31'),
('BILL007', 7, 7, 'March', 2024, 5000.00, 95.00, 4750.00, 'Pending', '2024-03-31'),
('BILL008', 8, 8, 'March', 2024, 5000.00, 100.00, 5000.00, 'Paid', '2024-03-31');

-- ============================================
-- SUMMARY
-- ============================================

SELECT 'Sample data inserted successfully!' AS Status;
SELECT 
    (SELECT COUNT(*) FROM drivers) AS Drivers,
    (SELECT COUNT(*) FROM vehicles) AS Vehicles,
    (SELECT COUNT(*) FROM routes) AS Routes,
    (SELECT COUNT(*) FROM schedules) AS Schedules,
    (SELECT COUNT(*) FROM parents) AS Parents,
    (SELECT COUNT(*) FROM students) AS Students,
    (SELECT COUNT(*) FROM attendance) AS Attendance_Records,
    (SELECT COUNT(*) FROM notifications) AS Notifications,
    (SELECT COUNT(*) FROM sos_alerts) AS SOS_Alerts,
    (SELECT COUNT(*) FROM incidents) AS Incidents,
    (SELECT COUNT(*) FROM broadcast_alerts) AS Broadcasts,
    (SELECT COUNT(*) FROM safety_checks) AS Safety_Checks,
    (SELECT COUNT(*) FROM billing) AS Bills;
