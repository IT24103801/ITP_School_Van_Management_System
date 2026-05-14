-- ============================================
-- SAMPLE DATA FOR SCHOOL VAN MANAGEMENT SYSTEM
-- Use this to populate your database with demo data
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

-- Insert Attendance Records (Last 5 days)
INSERT INTO attendance (studentId, date, status, routeId, checkInTime, checkOutTime, notes) VALUES
-- Today
(1, CURDATE(), 'Present', 'R001', '07:10:00', '14:30:00', 'On time'),
(2, CURDATE(), 'Present', 'R002', '07:25:00', '14:45:00', 'On time'),
(3, CURDATE(), 'Absent', 'R003', NULL, NULL, 'Parent called - sick'),
(4, CURDATE(), 'Present', 'R004', '07:45:00', '15:00:00', 'On time'),
(6, CURDATE(), 'Present', 'R001', '07:12:00', '14:32:00', 'On time'),
(7, CURDATE(), 'Late', 'R002', '07:50:00', '14:50:00', 'Traffic delay'),
(8, CURDATE(), 'Present', 'R003', '07:30:00', '14:40:00', 'On time'),
-- Yesterday
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Present', 'R001', '07:08:00', '14:28:00', 'On time'),
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Present', 'R002', '07:22:00', '14:42:00', 'On time'),
(3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Present', 'R003', '07:32:00', '14:38:00', 'On time'),
(4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Present', 'R004', '07:48:00', '15:02:00', 'On time'),
(5, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Absent', 'R005', NULL, NULL, 'Family emergency'),
(6, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Present', 'R001', '07:10:00', '14:30:00', 'On time'),
(7, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Present', 'R002', '07:28:00', '14:48:00', 'On time'),
(8, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Present', 'R003', '07:35:00', '14:42:00', 'On time');

-- Insert Notifications
INSERT INTO notifications (studentId, parentId, type, message, status, sentAt) VALUES
(3, 3, 'Absence', 'Your child Olivia was marked absent today. Please confirm.', 'Sent', NOW()),
(7, 7, 'Late Arrival', 'Mason arrived 20 minutes late today due to traffic.', 'Sent', NOW()),
(1, 1, 'General', 'Reminder: School event tomorrow at 9 AM', 'Sent', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 2, 'Attendance', 'Liam has perfect attendance this week!', 'Sent', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 5, 'Absence', 'Ava was absent yesterday. Hope everything is okay.', 'Read', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- ============================================
-- MODULE 2: EMERGENCY & SAFETY
-- ============================================

-- Insert SOS Alerts
INSERT INTO sos_alerts (vanId, driverId, location, latitude, longitude, description, status, priority) VALUES
('CAB-1234', 1, 'Near Galle Face', 6.9271, 79.8612, 'Minor accident - no injuries', 'Resolved', 'Medium'),
('CAB-3456', 3, 'Galle Road Junction', 6.0535, 80.2210, 'Vehicle breakdown', 'In Progress', 'High'),
('CAB-2345', 2, 'Kandy City Center', 7.2906, 80.6337, 'Medical emergency - student feeling unwell', 'Resolved', 'High');

-- Insert Incidents
INSERT INTO incidents (vanId, driverId, incidentType, description, location, severity, status, reportedBy) VALUES
('CAB-1234', 1, 'Accident', 'Minor collision with parked vehicle. No injuries. Police report filed.', 'Colombo 03', 'Low', 'Resolved', 'John Smith'),
('CAB-4567', 4, 'Mechanical', 'Engine overheating. Vehicle towed to garage.', 'Negombo', 'Medium', 'Resolved', 'Emily Davis'),
('CAB-3456', 3, 'Medical', 'Student had allergic reaction. Taken to hospital, now stable.', 'Galle', 'High', 'Resolved', 'Michael Brown'),
('CAB-2345', 2, 'Traffic', 'Severe traffic delay due to road construction. 30 min late.', 'Kandy', 'Low', 'Resolved', 'Sarah Johnson');

-- Insert Broadcasts
INSERT INTO broadcasts (title, message, priority, targetAudience, expiresAt, status) VALUES
('School Closure Alert', 'School will be closed tomorrow due to weather conditions. All van services suspended.', 'High', 'All', DATE_ADD(NOW(), INTERVAL 1 DAY), 'Active'),
('Route Change Notice', 'Route R001 will take alternate path due to road repairs. Expect 10 min delay.', 'Medium', 'Parents', DATE_ADD(NOW(), INTERVAL 7 DAY), 'Active'),
('Safety Reminder', 'Please ensure students wear seatbelts at all times during transit.', 'Low', 'All', DATE_ADD(NOW(), INTERVAL 30 DAY), 'Active'),
('Maintenance Schedule', 'All vehicles will undergo safety inspection this weekend. No service on Saturday.', 'Medium', 'Parents', DATE_ADD(NOW(), INTERVAL 3 DAY), 'Active');

-- Insert Safety Checks
INSERT INTO safety_checks (vanId, driverId, checkType, status, notes, checkedBy) VALUES
('CAB-1234', 1, 'Pre-Trip', 'Passed', 'All systems normal. Tire pressure checked.', 'John Smith'),
('CAB-2345', 2, 'Pre-Trip', 'Passed', 'Minor windshield crack noted. Scheduled for repair.', 'Sarah Johnson'),
('CAB-3456', 3, 'Pre-Trip', 'Passed', 'All safety equipment present and functional.', 'Michael Brown'),
('CAB-4567', 4, 'Pre-Trip', 'Failed', 'Brake lights not working. Vehicle taken off service.', 'Emily Davis'),
('CAB-1234', 1, 'Post-Trip', 'Passed', 'No issues reported. Vehicle cleaned.', 'John Smith'),
('CAB-2345', 2, 'Post-Trip', 'Passed', 'Fuel level low. Refueled.', 'Sarah Johnson');

-- ============================================
-- MODULE 5: BILLING & PAYMENTS
-- ============================================

-- Insert Billing Records
INSERT INTO billing (studentId, parentId, amount, dueDate, status, description, invoiceNumber) VALUES
(1, 1, 5000.00, '2024-03-31', 'Paid', 'Monthly van service fee - March 2024', 'INV-2024-001'),
(2, 2, 5000.00, '2024-03-31', 'Paid', 'Monthly van service fee - March 2024', 'INV-2024-002'),
(3, 3, 5000.00, '2024-03-31', 'Pending', 'Monthly van service fee - March 2024', 'INV-2024-003'),
(4, 4, 5000.00, '2024-03-31', 'Paid', 'Monthly van service fee - March 2024', 'INV-2024-004'),
(5, 5, 5000.00, '2024-03-31', 'Overdue', 'Monthly van service fee - March 2024', 'INV-2024-005'),
(6, 6, 5000.00, '2024-03-31', 'Paid', 'Monthly van service fee - March 2024', 'INV-2024-006'),
(7, 7, 5000.00, '2024-03-31', 'Pending', 'Monthly van service fee - March 2024', 'INV-2024-007'),
(8, 8, 5000.00, '2024-03-31', 'Paid', 'Monthly van service fee - March 2024', 'INV-2024-008'),
-- Previous month
(1, 1, 5000.00, '2024-02-29', 'Paid', 'Monthly van service fee - February 2024', 'INV-2024-009'),
(2, 2, 5000.00, '2024-02-29', 'Paid', 'Monthly van service fee - February 2024', 'INV-2024-010'),
(3, 3, 5000.00, '2024-02-29', 'Paid', 'Monthly van service fee - February 2024', 'INV-2024-011'),
(4, 4, 5000.00, '2024-02-29', 'Paid', 'Monthly van service fee - February 2024', 'INV-2024-012');

-- Insert Payment Records
INSERT INTO payments (billingId, amount, paymentDate, paymentMethod, transactionId, status) VALUES
(1, 5000.00, '2024-03-05', 'Bank Transfer', 'TXN-20240305-001', 'Completed'),
(2, 5000.00, '2024-03-08', 'Cash', 'CASH-20240308-001', 'Completed'),
(4, 5000.00, '2024-03-10', 'Online', 'ONL-20240310-001', 'Completed'),
(6, 5000.00, '2024-03-12', 'Bank Transfer', 'TXN-20240312-001', 'Completed'),
(8, 5000.00, '2024-03-15', 'Cash', 'CASH-20240315-001', 'Completed'),
(9, 5000.00, '2024-02-05', 'Bank Transfer', 'TXN-20240205-001', 'Completed'),
(10, 5000.00, '2024-02-08', 'Online', 'ONL-20240208-001', 'Completed'),
(11, 5000.00, '2024-02-10', 'Cash', 'CASH-20240210-001', 'Completed'),
(12, 5000.00, '2024-02-12', 'Bank Transfer', 'TXN-20240212-001', 'Completed');

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
    (SELECT COUNT(*) FROM broadcasts) AS Broadcasts,
    (SELECT COUNT(*) FROM safety_checks) AS Safety_Checks,
    (SELECT COUNT(*) FROM billing) AS Bills,
    (SELECT COUNT(*) FROM payments) AS Payments;
