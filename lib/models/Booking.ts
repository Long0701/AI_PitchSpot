import mongoose, { Schema, Document } from 'mongoose';

export enum BookingStatus {
  Confirmed = 'confirmed',
  Pending = 'pending',
  Cancelled = 'cancelled',
  Completed = 'completed',
}

export enum PaymentStatus {
  Paid = 'paid',
  Pending = 'pending',
  Failed = 'failed',
}

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  field: mongoose.Types.ObjectId;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  totalCost: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    field: {
      type: Schema.Types.ObjectId,
      ref: 'Field',
      required: [true, 'Field is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
      validate: {
        validator: function(v: string) {
          const date = new Date(v);
          return !isNaN(date.getTime()) && date >= new Date();
        },
        message: 'Date must be a valid future date',
      },
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      validate: {
        validator: function(v: string) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'Start time must be in HH:MM format',
      },
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      validate: {
        validator: function(v: string) {
          return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: 'End time must be in HH:MM format',
      },
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [0.5, 'Duration must be at least 0.5 hours'],
      max: [24, 'Duration cannot exceed 24 hours'],
    },
    totalCost: {
      type: Number,
      required: [true, 'Total cost is required'],
      min: [0, 'Total cost must be positive'],
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.Pending,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ user: 1 });
bookingSchema.index({ field: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ createdAt: -1 });

// Compound indexes for common queries
bookingSchema.index({ user: 1, date: 1 });
bookingSchema.index({ field: 1, date: 1 });
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ field: 1, status: 1 });

// Validate that end time is after start time
bookingSchema.pre('save', function(next) {
  if (this.isModified('startTime') || this.isModified('endTime')) {
    const start = new Date(`2000-01-01T${this.startTime}:00`);
    const end = new Date(`2000-01-01T${this.endTime}:00`);
    
    if (end <= start) {
      return next(new Error('End time must be after start time'));
    }
  }
  next();
});

// Calculate duration automatically if not provided
bookingSchema.pre('save', function(next) {
  if (!this.duration && this.startTime && this.endTime) {
    const start = new Date(`2000-01-01T${this.startTime}:00`);
    const end = new Date(`2000-01-01T${this.endTime}:00`);
    this.duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }
  next();
});

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema); 