"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockReviews, mockCourts } from "@/lib/mock-data"
import { Star } from "lucide-react"

interface CourtReviewsDisplayProps {
  courtId: string
  isOpen: boolean
  onClose: () => void
}

export function CourtReviewsDisplay({ courtId, isOpen, onClose }: CourtReviewsDisplayProps) {
  const court = mockCourts.find((c) => c.id === courtId)
  const reviews = mockReviews.filter((review) => review.courtId === courtId)

  if (!court) return null

  const getAspectName = (aspect: string) => {
    switch (aspect) {
      case "cleanliness":
        return "Sạch Sẽ"
      case "lighting":
        return "Ánh Sáng"
      case "equipment":
        return "Thiết Bị"
      case "location":
        return "Vị Trí"
      default:
        return aspect
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đánh Giá cho {court.name}</DialogTitle>
          <DialogDescription>Xem tất cả đánh giá từ người dùng khác</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                      <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{review.userName}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{review.rating} / 5</span>
                        <span className="ml-2 text-xs">{new Date(review.createdAt).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-800 mb-4">{review.comment}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(review.aspects).map(([aspect, score]) => (
                      <div key={aspect} className="flex items-center space-x-1">
                        <span className="font-medium">{getAspectName(aspect)}:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${star <= score ? "fill-blue-400 text-blue-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Star className="w-12 h-12 mx-auto mb-4" />
              <p>Chưa có đánh giá nào cho sân này.</p>
              <p>Hãy là người đầu tiên đánh giá!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
