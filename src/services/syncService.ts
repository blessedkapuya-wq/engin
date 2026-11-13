/**
 * Google Cloud Firestore Synchronization Service for Bareglow Boutiques & Spa
 * Real-time cross-device sync between reception tablet and owner mobile
 */

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, testConnection, handleFirestoreError, OperationType } from '../firebase';
import {
  DailySaleEntry,
  SalonExpense,
  DailyTillHandover,
  StaffReport,
  StaffMember,
  OwnerVaultState,
} from '../types/salon';
import {
  PoultryBatch,
  PoultrySale,
  PoultryExpense,
  FeedRecord,
  VaccinationRecord,
  MortalityRecord
} from '../types/poultry';

export const syncService = {
  // Check if Firestore is reachable
  async checkConnection(): Promise<boolean> {
    return await testConnection();
  },

  // ==========================================
  // BLESSED POULTRY FARM FIRESTORE SYNC
  // ==========================================

  // Save or update a broiler batch in Firestore
  async savePoultryBatch(batch: PoultryBatch): Promise<void> {
    const path = `poultry_batches/${batch.id}`;
    try {
      await setDoc(doc(db, 'poultry_batches', batch.id), {
        id: batch.id,
        batchNumber: batch.batchName || 'Batch',
        breed: batch.breed || 'Cobb 500 Broiler',
        entryDate: batch.entryDate || new Date().toISOString().split('T')[0],
        orderDate: batch.orderDate || '',
        expectedDeliveryDate: batch.expectedDeliveryDate || '',
        deliveryStatus: batch.deliveryStatus || 'Delivered to Farm',
        hatcheryOrderRef: batch.hatcheryOrderRef || '',
        isSupplierPaid: Boolean(batch.isSupplierPaid),
        initialQuantity: Number(batch.initialQuantity) || 0,
        currentQuantity: Number(batch.currentQuantity) || 0,
        purchasePricePerBirdTZS: Number(batch.purchasePricePerBirdTZS) || 0,
        totalPurchaseCostTZS: Number(batch.totalPurchaseCostTZS) || 0,
        supplier: batch.supplier || 'Interchick Tanzania',
        sourceType: batch.sourceType || 'Day-old chicks',
        stage: batch.stage || 'Day 1-7 (Brooding & Starter)',
        targetSellingPricePerBirdTZS: Number(batch.targetSellingPricePerBirdTZS) || 0,
        targetWeightKg: Number(batch.targetWeightKg) || 2.0,
        currentAverageWeightKg: Number(batch.currentAverageWeightKg) || 0,
        status: batch.status || 'Active',
        notes: batch.notes || '',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deletePoultryBatch(batchId: string): Promise<void> {
    const path = `poultry_batches/${batchId}`;
    try {
      await deleteDoc(doc(db, 'poultry_batches', batchId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToPoultryBatches(onUpdate: (batches: PoultryBatch[]) => void) {
    const colRef = collection(db, 'poultry_batches');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PoultryBatch[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              batchName: data.batchNumber || data.batchName || 'Batch',
              breed: data.breed || 'Cobb 500 Broiler',
              entryDate: data.entryDate || new Date().toISOString().split('T')[0],
              orderDate: data.orderDate,
              expectedDeliveryDate: data.expectedDeliveryDate,
              deliveryStatus: data.deliveryStatus || 'Delivered to Farm',
              hatcheryOrderRef: data.hatcheryOrderRef,
              isSupplierPaid: data.isSupplierPaid ?? true,
              initialQuantity: Number(data.initialQuantity) || 0,
              currentQuantity: Number(data.currentQuantity) || 0,
              purchasePricePerBirdTZS: Number(data.purchasePricePerBirdTZS) || 0,
              totalPurchaseCostTZS: Number(data.totalPurchaseCostTZS) || 0,
              supplier: data.supplier || 'Interchick Tanzania',
              sourceType: data.sourceType || 'Day-old chicks',
              stage: data.stage || 'Day 1-7 (Brooding & Starter)',
              targetSellingPricePerBirdTZS: Number(data.targetSellingPricePerBirdTZS) || 11500,
              targetWeightKg: Number(data.targetWeightKg) || 2.0,
              currentAverageWeightKg: Number(data.currentAverageWeightKg) || 0,
              status: (data.status as any) || 'Active',
              notes: data.notes || ''
            };
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore poultry batches snapshot note:', error);
      }
    );
  },

  // Save or update poultry sale (including delivered unpaid credits)
  async savePoultrySale(sale: PoultrySale): Promise<void> {
    const path = `poultry_sales/${sale.id}`;
    try {
      await setDoc(doc(db, 'poultry_sales', sale.id), {
        id: sale.id,
        batchId: sale.batchId,
        batchName: sale.batchName || '',
        date: sale.date || new Date().toISOString().split('T')[0],
        saleType: sale.saleType || 'Live Broilers (Kuku Hai)',
        birdsCount: Number(sale.quantitySold) || 0,
        sellingPricePerUnitTZS: Number(sale.sellingPricePerUnitTZS) || 0,
        totalAmountTZS: Number(sale.totalRevenueTZS) || 0,
        buyerName: sale.buyerName || 'Walk-in Customer',
        buyerPhone: sale.buyerPhone || '',
        deliveryStatus: sale.deliveryStatus || 'Delivered',
        deliveredDate: sale.deliveredDate || sale.date,
        paymentStatus: sale.paymentStatus || 'Paid',
        amountPaidTZS: Number(sale.amountPaidTZS ?? sale.totalRevenueTZS) || 0,
        amountDueTZS: Number(sale.amountDueTZS ?? 0) || 0,
        paymentDueDate: sale.paymentDueDate || '',
        paymentMethod: sale.paymentMethod || 'Cash',
        paymentRef: sale.paymentRef || '',
        notes: sale.notes || '',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deletePoultrySale(saleId: string): Promise<void> {
    const path = `poultry_sales/${saleId}`;
    try {
      await deleteDoc(doc(db, 'poultry_sales', saleId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToPoultrySales(onUpdate: (sales: PoultrySale[]) => void) {
    const colRef = collection(db, 'poultry_sales');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PoultrySale[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              batchId: data.batchId || '',
              batchName: data.batchName || '',
              date: data.date || new Date().toISOString().split('T')[0],
              saleType: (data.saleType as any) || 'Live Broilers (Kuku Hai)',
              quantitySold: Number(data.birdsCount ?? data.quantitySold) || 0,
              sellingPricePerUnitTZS: Number(data.sellingPricePerUnitTZS) || 0,
              totalRevenueTZS: Number(data.totalAmountTZS ?? data.totalRevenueTZS) || 0,
              buyerName: data.buyerName || 'Mteja',
              buyerPhone: data.buyerPhone || '',
              deliveryStatus: (data.deliveryStatus as any) || 'Delivered',
              deliveredDate: data.deliveredDate,
              paymentStatus: (data.paymentStatus as any) || 'Paid',
              amountPaidTZS: Number(data.amountPaidTZS) || 0,
              amountDueTZS: Number(data.amountDueTZS) || 0,
              paymentDueDate: data.paymentDueDate,
              paymentMethod: (data.paymentMethod as any) || 'Cash',
              paymentRef: data.paymentRef || '',
              notes: data.notes || ''
            };
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore poultry sales snapshot note:', error);
      }
    );
  },

  // Save or update poultry expense (e.g. Pumba, Medecine, Maranda, etc.)
  async savePoultryExpense(expense: PoultryExpense): Promise<void> {
    const path = `poultry_expenses/${expense.id}`;
    try {
      await setDoc(doc(db, 'poultry_expenses', expense.id), {
        id: expense.id,
        batchId: expense.batchId || '',
        batchName: expense.batchName || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        category: expense.category || 'Other',
        description: expense.description || '',
        amountTZS: Number(expense.amountTZS) || 0,
        paidTo: expense.paidTo || '',
        paymentMethod: expense.paymentMethod || 'Cash',
        receiptRef: expense.receiptRef || '',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deletePoultryExpense(expenseId: string): Promise<void> {
    const path = `poultry_expenses/${expenseId}`;
    try {
      await deleteDoc(doc(db, 'poultry_expenses', expenseId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToPoultryExpenses(onUpdate: (expenses: PoultryExpense[]) => void) {
    const colRef = collection(db, 'poultry_expenses');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PoultryExpense[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              batchId: data.batchId,
              batchName: data.batchName,
              date: data.date || new Date().toISOString().split('T')[0],
              category: (data.category as any) || 'Other',
              description: data.description || '',
              amountTZS: Number(data.amountTZS) || 0,
              paidTo: data.paidTo || '',
              paymentMethod: (data.paymentMethod as any) || 'Cash',
              receiptRef: data.receiptRef || ''
            };
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore poultry expenses snapshot note:', error);
      }
    );
  },

  // Save or update poultry feed
  async savePoultryFeed(feed: FeedRecord): Promise<void> {
    const path = `poultry_feeds/${feed.id}`;
    try {
      await setDoc(doc(db, 'poultry_feeds', feed.id), {
        id: feed.id,
        batchId: feed.batchId,
        batchName: feed.batchName,
        date: feed.date,
        feedType: feed.feedType,
        quantityBags: Number(feed.quantityKg) || 0,
        costPerKgTZS: Number(feed.costPerKgTZS) || 0,
        totalCostTZS: Number(feed.totalCostTZS) || 0,
        brandOrSource: feed.brandOrSource || '',
        notes: feed.notes || '',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToPoultryFeeds(onUpdate: (feeds: FeedRecord[]) => void) {
    const colRef = collection(db, 'poultry_feeds');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: FeedRecord[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              batchId: data.batchId || '',
              batchName: data.batchName || '',
              date: data.date || new Date().toISOString().split('T')[0],
              feedType: (data.feedType as any) || 'Broiler Starter',
              quantityKg: Number(data.quantityBags ?? data.quantityKg) || 0,
              costPerKgTZS: Number(data.costPerKgTZS) || 0,
              totalCostTZS: Number(data.totalCostTZS) || 0,
              brandOrSource: data.brandOrSource || '',
              notes: data.notes || ''
            };
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore feeds snapshot note:', error);
      }
    );
  },

  // Save or update poultry vaccine
  async savePoultryVaccine(vax: VaccinationRecord): Promise<void> {
    const path = `poultry_vaccines/${vax.id}`;
    try {
      await setDoc(doc(db, 'poultry_vaccines', vax.id), {
        id: vax.id,
        batchId: vax.batchId,
        batchName: vax.batchName,
        vaccineName: vax.vaccineName,
        targetDate: vax.targetDate,
        administeredDate: vax.administeredDate || '',
        status: vax.status,
        route: vax.route,
        costTZS: Number(vax.costTZS) || 0,
        administeredBy: vax.administeredBy || '',
        notes: vax.notes || '',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToPoultryVaccines(onUpdate: (vaxes: VaccinationRecord[]) => void) {
    const colRef = collection(db, 'poultry_vaccines');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: VaccinationRecord[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              batchId: data.batchId || '',
              batchName: data.batchName || '',
              vaccineName: data.vaccineName || 'Vaccine',
              targetDate: data.targetDate || '',
              administeredDate: data.administeredDate,
              status: (data.status as any) || 'Scheduled',
              route: (data.route as any) || 'Drinking Water',
              costTZS: Number(data.costTZS) || 0,
              administeredBy: data.administeredBy || '',
              notes: data.notes || ''
            };
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore vaccines snapshot note:', error);
      }
    );
  },

  // Save or update poultry mortality
  async savePoultryMortality(mortality: MortalityRecord): Promise<void> {
    const path = `poultry_mortalities/${mortality.id}`;
    try {
      await setDoc(doc(db, 'poultry_mortalities', mortality.id), {
        id: mortality.id,
        batchId: mortality.batchId,
        batchName: mortality.batchName,
        date: mortality.date,
        count: Number(mortality.deathCount) || 0,
        suspectedCause: mortality.suspectedCause || 'Unknown',
        actionTaken: mortality.actionTaken || '',
        notes: mortality.notes || '',
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToPoultryMortalities(onUpdate: (mortalities: MortalityRecord[]) => void) {
    const colRef = collection(db, 'poultry_mortalities');
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: MortalityRecord[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              batchId: data.batchId || '',
              batchName: data.batchName || '',
              date: data.date || '',
              deathCount: Number(data.count ?? data.deathCount) || 0,
              suspectedCause: (data.suspectedCause as any) || 'Unknown',
              actionTaken: data.actionTaken || '',
              notes: data.notes || ''
            };
          });
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore mortalities snapshot note:', error);
      }
    );
  },

  // Batch sync all current local poultry records to Firestore for safety
  async syncAllPoultryData(data: {
    batches: PoultryBatch[];
    sales: PoultrySale[];
    expenses: PoultryExpense[];
    feeds: FeedRecord[];
    vaccinations: VaccinationRecord[];
    mortalities: MortalityRecord[];
  }): Promise<{ success: boolean; count: number }> {
    let synced = 0;
    try {
      for (const b of data.batches) {
        await this.savePoultryBatch(b);
        synced++;
      }
      for (const s of data.sales) {
        await this.savePoultrySale(s);
        synced++;
      }
      for (const e of data.expenses) {
        await this.savePoultryExpense(e);
        synced++;
      }
      for (const f of data.feeds) {
        await this.savePoultryFeed(f);
        synced++;
      }
      for (const v of data.vaccinations) {
        await this.savePoultryVaccine(v);
        synced++;
      }
      for (const m of data.mortalities) {
        await this.savePoultryMortality(m);
        synced++;
      }
      return { success: true, count: synced };
    } catch (err) {
      console.error('Error syncing all poultry data:', err);
      return { success: false, count: synced };
    }
  },

  // ==========================================
  // SALON FIRESTORE SYNC
  // ==========================================

  // Save or update a sale in Firestore
  async saveSale(sale: DailySaleEntry): Promise<void> {
    const path = `sales/${sale.id}`;
    try {
      await setDoc(doc(db, 'sales', sale.id), {
        id: sale.id,
        clientName: sale.clientName || 'Walk-in Client',
        clientPhone: sale.clientPhone || '',
        staffName: sale.staffName || '',
        serviceName: sale.itemName || '',
        type: sale.type || 'Service',
        amount: Number(sale.amountKSh) || 0,
        paymentMethod: sale.paymentMethod || 'M-Pesa',
        date: sale.date || new Date().toISOString().split('T')[0],
        time: sale.time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        timestamp: `${sale.date}T${sale.time}`,
        notes: sale.notes || ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save or update an expense in Firestore
  async saveExpense(expense: SalonExpense): Promise<void> {
    const path = `expenses/${expense.id}`;
    try {
      await setDoc(doc(db, 'expenses', expense.id), {
        id: expense.id,
        category: expense.category || 'Other',
        amount: Number(expense.amountKSh) || 0,
        description: expense.description || '',
        paidTo: expense.paidTo || '',
        paymentMethod: expense.paymentMethod || 'Cash',
        receiptRef: expense.receiptRef || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        timestamp: `${expense.date}T12:00:00`
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save or update a till handover in Firestore
  async saveHandover(handover: DailyTillHandover): Promise<void> {
    const path = `handovers/${handover.id}`;
    try {
      await setDoc(doc(db, 'handovers', handover.id), {
        id: handover.id,
        date: handover.date || new Date().toISOString().split('T')[0],
        closingTime: handover.closingTime || '20:00',
        cashierName: handover.cashierName || 'Receptionist',
        totalSalesCount: handover.totalSalesCount || 0,
        grossSalesKSh: handover.grossSalesKSh || 0,
        cashInDrawer: Number(handover.actualCashKSh) || 0,
        mpesaTillBalance: Number(handover.actualMpesaKSh) || 0,
        expectedCashKSh: handover.expectedCashKSh || 0,
        expectedMpesaKSh: handover.expectedMpesaKSh || 0,
        cashVarianceKSh: handover.cashVarianceKSh || 0,
        mpesaVarianceKSh: handover.mpesaVarianceKSh || 0,
        totalExpensesKSh: handover.totalExpensesKSh || 0,
        status: handover.status || 'Balanced',
        notes: handover.notes || '',
        submittedAt: handover.submittedAt || new Date().toISOString(),
        timestamp: handover.submittedAt || new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save or update a staff daily report in Firestore
  async saveReport(report: StaffReport): Promise<void> {
    const path = `reports/${report.id}`;
    try {
      await setDoc(doc(db, 'reports', report.id), {
        id: report.id,
        staffId: report.id,
        staffName: report.staffName || '',
        position: report.position || '',
        weekCommencing: report.weekCommencing || '',
        submissionDate: report.submissionDate || '',
        weeklyTotal: Number(report.weeklyTotal) || 0,
        date: report.submissionDate || new Date().toISOString().split('T')[0],
        timestamp: report.submissionDate ? `${report.submissionDate}T18:00:00` : new Date().toISOString(),
        isReviewed: Boolean(report.isReviewed)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save or update staff member roster in Firestore
  async saveStaff(staff: StaffMember): Promise<void> {
    const path = `staff/${staff.id}`;
    try {
      await setDoc(doc(db, 'staff', staff.id), {
        id: staff.id,
        name: staff.name,
        position: staff.position,
        phone: staff.phone || '',
        email: staff.email || '',
        accessPin: staff.accessPin || '1234',
        payType: staff.payType || 'commission',
        baseSalaryKSh: staff.baseSalaryKSh || 0,
        commissionRateServices: staff.commissionRateServices || 0.3,
        status: staff.status || 'active',
        active: staff.status === 'active'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Save vault state
  async saveVault(vault: OwnerVaultState): Promise<void> {
    const path = 'vault/state';
    try {
      await setDoc(doc(db, 'vault', 'state'), {
        id: 'state',
        cashVault: Number(vault.withdrawableProfitKSh) || 0,
        mpesaFloat: Number(vault.totalGrossRevenueKSh) || 0,
        emergencyReserve: Number(vault.salonEmergencyReserveKSh) || 0,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Listen to real-time sales updates
  subscribeToSales(onUpdate: (sales: DailySaleEntry[]) => void) {
    const salesCol = collection(db, 'sales');
    return onSnapshot(
      salesCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: DailySaleEntry[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              date: data.date || (data.timestamp || '').split('T')[0] || new Date().toISOString().split('T')[0],
              time: data.time || '10:00',
              clientName: data.clientName || 'Walk-in Client',
              clientPhone: data.clientPhone || '',
              staffName: data.staffName || 'Stylist',
              type: (data.type as any) || 'Service',
              itemName: data.serviceName || 'Salon Service',
              quantity: 1,
              amountKSh: Number(data.amount) || 0,
              paymentMethod: (data.paymentMethod === 'Cash' ? 'Cash' : 'M-Pesa') as 'M-Pesa' | 'Cash',
              notes: data.notes || ''
            };
          });
          onUpdate(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'sales');
      }
    );
  },

  // Listen to real-time expenses updates
  subscribeToExpenses(onUpdate: (expenses: SalonExpense[]) => void) {
    const expCol = collection(db, 'expenses');
    return onSnapshot(
      expCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: SalonExpense[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              date: data.date || (data.timestamp || '').split('T')[0] || new Date().toISOString().split('T')[0],
              category: (data.category as any) || 'Other',
              description: data.description || '',
              amountKSh: Number(data.amount) || 0,
              paidTo: data.paidTo || 'Vendor',
              paymentMethod: (data.paymentMethod as any) || 'Cash',
              receiptRef: data.receiptRef || ''
            };
          });
          onUpdate(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'expenses');
      }
    );
  },

  // Listen to real-time till handovers
  subscribeToHandovers(onUpdate: (handovers: DailyTillHandover[]) => void) {
    const handoversCol = collection(db, 'handovers');
    return onSnapshot(
      handoversCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: DailyTillHandover[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: data.id || d.id,
              date: data.date || new Date().toISOString().split('T')[0],
              closingTime: data.closingTime || '20:00',
              cashierName: data.cashierName || 'Receptionist',
              totalSalesCount: Number(data.totalSalesCount) || 1,
              grossSalesKSh: Number(data.grossSalesKSh) || 0,
              expectedCashKSh: Number(data.expectedCashKSh) || 0,
              actualCashKSh: Number(data.cashInDrawer) || 0,
              cashVarianceKSh: Number(data.cashVarianceKSh) || 0,
              expectedMpesaKSh: Number(data.expectedMpesaKSh) || 0,
              actualMpesaKSh: Number(data.mpesaTillBalance) || 0,
              mpesaVarianceKSh: Number(data.mpesaVarianceKSh) || 0,
              cashExpensesPaidKSh: 0,
              totalExpensesKSh: Number(data.totalExpensesKSh) || 0,
              status: (data.status as any) || 'Balanced',
              notes: data.notes || '',
              submittedAt: data.submittedAt || new Date().toISOString()
            };
          });
          onUpdate(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'handovers');
      }
    );
  }
};
