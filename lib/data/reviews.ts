import { type Review } from "../types"

export const reviewsData: Review[] = [
  {
    id: "review1",
    courtId: "1",
    userId: "user1",
    userName: "Nguyễn Văn A",
    rating: 5,
    comment: "Cơ sở vật chất tuyệt vời với ánh sáng tốt và phòng thay đồ sạch sẽ. Nhân viên rất nhiệt tình!",
    aspects: {
      cleanliness: 5,
      lighting: 5,
      equipment: 4,
      location: 5,
    },
    createdAt: "2024-01-10T10:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: "review2",
    courtId: "1",
    userId: "user2",
    userName: "Trần Thị B",
    rating: 4,
    comment: "Sân tốt nhưng chỗ đậu xe có thể khó khăn vào giờ cao điểm.",
    aspects: {
      cleanliness: 4,
      lighting: 5,
      equipment: 4,
      location: 3,
    },
    createdAt: "2024-01-08T14:30:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    id: "review3",
    courtId: "2",
    userId: "user3",
    userName: "Lê Văn C",
    rating: 5,
    comment: "Sân cầu lông rất chuyên nghiệp, sàn gỗ êm ái và không khí trong lành.",
    aspects: {
      cleanliness: 5,
      lighting: 5,
      equipment: 5,
      location: 4,
    },
    createdAt: "2024-01-11T09:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=le",
  },
  {
    id: "review4",
    courtId: "3",
    userId: "user1",
    userName: "Nguyễn Văn A",
    rating: 4,
    comment: "Sân tennis ngoài trời đẹp, nhưng hơi nắng vào buổi trưa.",
    aspects: {
      cleanliness: 4,
      lighting: 3,
      equipment: 4,
      location: 5,
    },
    createdAt: "2024-01-15T10:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: "review5",
    courtId: "1",
    userId: "user4",
    userName: "Phạm Thị D",
    rating: 5,
    comment: "Sân bóng đá rất rộng rãi, có đủ chỗ cho cả đội. Ánh sáng ban đêm rất tốt!",
    aspects: {
      cleanliness: 5,
      lighting: 5,
      equipment: 5,
      location: 4,
    },
    createdAt: "2024-01-12T16:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pham",
  },
  {
    id: "review6",
    courtId: "2",
    userId: "user5",
    userName: "Hoàng Văn E",
    rating: 4,
    comment: "Sân cầu lông tốt, nhưng giá hơi cao so với các sân khác trong khu vực.",
    aspects: {
      cleanliness: 4,
      lighting: 4,
      equipment: 4,
      location: 4,
    },
    createdAt: "2024-01-09T11:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hoang",
  },
  {
    id: "review7",
    courtId: "3",
    userId: "user6",
    userName: "Vũ Thị F",
    rating: 5,
    comment: "Sân tennis rất đẹp với view thành phố tuyệt vời. Huấn luyện viên rất chuyên nghiệp.",
    aspects: {
      cleanliness: 5,
      lighting: 4,
      equipment: 5,
      location: 5,
    },
    createdAt: "2024-01-14T15:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vu",
  },
  {
    id: "review8",
    courtId: "4",
    userId: "user7",
    userName: "Đỗ Văn G",
    rating: 5,
    comment: "Sân bóng rổ trong nhà rất tốt, có điều hòa và ánh sáng đầy đủ. Rất thích!",
    aspects: {
      cleanliness: 5,
      lighting: 5,
      equipment: 5,
      location: 4,
    },
    createdAt: "2024-01-13T19:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=do",
  },
  {
    id: "review9",
    courtId: "5",
    userId: "user8",
    userName: "Lý Thị H",
    rating: 4,
    comment: "Sân bóng chuyền bãi biển rất thú vị, view biển đẹp nhưng hơi nắng.",
    aspects: {
      cleanliness: 4,
      lighting: 3,
      equipment: 4,
      location: 5,
    },
    createdAt: "2024-01-16T10:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ly",
  },
  {
    id: "review10",
    courtId: "6",
    userId: "user9",
    userName: "Trịnh Văn I",
    rating: 4,
    comment: "Sân pickleball mới và sạch sẽ. Nhân viên nhiệt tình hướng dẫn cho người mới.",
    aspects: {
      cleanliness: 5,
      lighting: 4,
      equipment: 4,
      location: 4,
    },
    createdAt: "2024-01-17T14:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=trinh",
  },
  // Add more reviews to match the review counts in courts data
  {
    id: "review11",
    courtId: "1",
    userId: "user10",
    userName: "Bùi Thị J",
    rating: 5,
    comment: "Sân bóng đá rất chuyên nghiệp, có đủ thiết bị và phòng thay đồ sạch sẽ.",
    aspects: {
      cleanliness: 5,
      lighting: 5,
      equipment: 5,
      location: 4,
    },
    createdAt: "2024-01-18T09:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bui",
  },
  {
    id: "review12",
    courtId: "2",
    userId: "user11",
    userName: "Ngô Văn K",
    rating: 4,
    comment: "Sân cầu lông tốt, điều hòa mát và có cho thuê vợt chất lượng.",
    aspects: {
      cleanliness: 4,
      lighting: 4,
      equipment: 5,
      location: 4,
    },
    createdAt: "2024-01-19T16:00:00Z",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ngo",
  },
]

// Generate additional reviews to match the review counts
export function generateReviewsForCourt(courtId: string, count: number): Review[] {
  const baseReviews = reviewsData.filter(review => review.courtId === courtId)
  const additionalReviews: Review[] = []
  
  for (let i = baseReviews.length; i < count; i++) {
    const rating = Math.floor(Math.random() * 2) + 4 // 4-5 stars
    additionalReviews.push({
      id: `review${courtId}-${i + 1}`,
      courtId,
      userId: `user${i + 20}`,
      userName: `Người dùng ${i + 1}`,
      rating,
      comment: `Đánh giá tốt về sân thể thao. Chất lượng ${rating >= 4 ? 'tốt' : 'khá'}.`,
      aspects: {
        cleanliness: rating,
        lighting: rating,
        equipment: rating - 1,
        location: rating,
      },
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`,
    })
  }
  
  return [...baseReviews, ...additionalReviews]
}

export function getReviewsByCourtId(courtId: string): Review[] {
  return reviewsData.filter(review => review.courtId === courtId)
} 