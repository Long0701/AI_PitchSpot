import mongoose, { Schema, Document } from 'mongoose';
import { SportType } from '../types';

export interface ITimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
}

export interface IField extends Document {
  name: string;
  description: string;
  sportType: SportType;
  location: {
    address: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  pricing: {
    hourlyRate: number;
    currency: string;
  };
  images: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  owner: mongoose.Types.ObjectId;
  availability: ITimeSlot[];
  features: {
    lighting: boolean;
    parking: boolean;
    restrooms: boolean;
    equipment: boolean;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const timeSlotSchema = new Schema<ITimeSlot>({
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
});

const fieldSchema = new Schema<IField>(
  {
    name: {
      type: String,
      required: [true, 'Field name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    sportType: {
      type: String,
      enum: ['football', 'badminton', 'tennis', 'volleyball', 'basketball', 'pickleball'],
      required: [true, 'Sport type is required'],
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      coordinates: {
        lat: {
          type: Number,
          required: [true, 'Latitude is required'],
          min: -90,
          max: 90,
        },
        lng: {
          type: Number,
          required: [true, 'Longitude is required'],
          min: -180,
          max: 180,
        },
      },
    },
    pricing: {
      hourlyRate: {
        type: Number,
        required: [true, 'Hourly rate is required'],
        min: [0, 'Hourly rate must be positive'],
      },
      currency: {
        type: String,
        default: 'VND',
        enum: ['VND', 'USD'],
      },
    },
    images: [{
      type: String,
      validate: {
        validator: function(v: string) {
          return v.startsWith('http') || v.startsWith('/');
        },
        message: 'Image URL must be a valid URL or path',
      },
    }],
    amenities: [{
      type: String,
      trim: true,
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner is required'],
    },
    availability: [timeSlotSchema],
    features: {
      lighting: {
        type: Boolean,
        default: false,
      },
      parking: {
        type: Boolean,
        default: false,
      },
      restrooms: {
        type: Boolean,
        default: false,
      },
      equipment: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
fieldSchema.index({ 'location.coordinates': '2dsphere' });
fieldSchema.index({ 'location.city': 1 });
fieldSchema.index({ sportType: 1 });
fieldSchema.index({ owner: 1 });
fieldSchema.index({ rating: -1 });
fieldSchema.index({ isActive: 1 });
fieldSchema.index({ createdAt: -1 });

// Compound indexes for common queries
fieldSchema.index({ 'location.city': 1, sportType: 1 });
fieldSchema.index({ 'location.city': 1, isActive: 1 });
fieldSchema.index({ sportType: 1, isActive: 1 });

// Virtual for average rating calculation
fieldSchema.virtual('averageRating').get(function() {
  return this.reviewCount > 0 ? this.rating : 0;
});

// Ensure virtuals are included in JSON output
fieldSchema.set('toJSON', { virtuals: true });
fieldSchema.set('toObject', { virtuals: true });

export const Field = mongoose.models.Field || mongoose.model<IField>('Field', fieldSchema); 