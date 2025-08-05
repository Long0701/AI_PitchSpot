"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockCourts } from "@/lib/mock-data"
import { SPORTS_CONFIG, type SportType } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, MapPin, Star, DollarSign } from "lucide-react"
import { formatVND } from "@/lib/utils"

export function CourtManagement() {
  const [ownerCourts, setOwnerCourts] = useState(mockCourts.filter((court) => court.ownerId === "owner1"))
  const [editingCourtId, setEditingCourtId] = useState<string | null | undefined>(undefined)
  const { toast } = useToast()

  const [newCourtDetails, setNewCourtDetails] = useState({
    name: "",
    description: "",
    sportType: "football" as SportType,
    address: "",
    city: "",
    hourlyRate: 200000, 
    amenities: [] as string[],
  })

  const editingCourt = useMemo(() => {
    return ownerCourts.find((c) => c.id === editingCourtId) || null
  }, [editingCourtId, ownerCourts])

  useEffect(() => {
    if (editingCourt) {
      setNewCourtDetails({
        name: editingCourt.name,
        description: editingCourt.description,
        sportType: editingCourt.sportType,
        address: editingCourt.location?.address || "",
        city: editingCourt.location?.city || "",
        hourlyRate: editingCourt.pricing?.hourlyRate || 200000,
        amenities: editingCourt.amenities || [],
      })
    } else {
      setNewCourtDetails({
        name: "",
        description: "",
        sportType: "football",
        address: "",
        city: "",
        hourlyRate: 200000,
        amenities: [],
      })
    }
  }, [editingCourtId])

  const handleSaveCourt = () => {
    const isEditing = editingCourtId !== null && editingCourtId !== undefined

    const id = isEditing ? editingCourtId! : `court-${Date.now()}`
  
    const court = {
      id,
      name: newCourtDetails.name,
      description: newCourtDetails.description,
      sportType: newCourtDetails.sportType,
      location: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.006 + (Math.random() - 0.5) * 0.1,
        address: newCourtDetails.address,
        city: newCourtDetails.city,
      },
      pricing: {
        hourlyRate: newCourtDetails.hourlyRate,
        currency: "VND",
      },
      images: ["/placeholder.svg"],
      amenities: newCourtDetails.amenities,
      rating: isEditing ? editingCourt?.rating || 0 : 0,
      reviewCount: isEditing ? editingCourt?.reviewCount || 0 : 0,
      ownerId: "owner1",
      availability: [],
      features: {
        lighting: true,
        parking: true,
        restrooms: true,
        equipment: true,
      },
    }
  
    const updatedCourts = isEditing
      ? ownerCourts.map((c) => (c.id === court.id ? court : c))
      : [...ownerCourts, court]
  
    setOwnerCourts(updatedCourts)
    setEditingCourtId(undefined)
  
    toast({
      title: isEditing ? "Cập nhật sân thành công" : "Thêm sân mới thành công!",
      description: `${court.name} đã được ${isEditing ? "cập nhật" : "tạo"}.`,
    })
  }

  const handleDeleteCourt = (courtId: string) => {
    setOwnerCourts(ownerCourts.filter((court) => court.id !== courtId))
    toast({
      title: "Đã xóa sân",
      description: "Sân đã được gỡ khỏi danh sách của bạn.",
    })
  }

  const handleEditCourt = (courtId: string) => {
    setEditingCourtId(courtId)
  }

  const handleAddCourt = () => {
    setEditingCourtId('')
  }

  const handleCloseModal = () => {
    setEditingCourtId(undefined)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sân Của Tôi</h2>
          <p className="text-gray-600">Quản lý các sân thể thao và cơ sở vật chất của bạn</p>
        </div>
        <Button onClick={handleAddCourt}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Sân
            </Button>
        <Dialog open={editingCourtId !== undefined} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCourtId ? "Chỉnh Sửa Sân" : "Thêm Sân Mới"}</DialogTitle>
              <DialogDescription>
                {editingCourtId ? "Cập nhật thông tin sân thể thao của bạn" : "Tạo một danh sách sân mới cho cơ sở của bạn"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tên Sân</Label>
                  <Input
                    id="name"
                    value={newCourtDetails.name}
                    onChange={(e) => setNewCourtDetails({ ...newCourtDetails, name: e.target.value })}
                    placeholder="Khu Liên Hợp Thể Thao Trung Tâm"
                  />
                </div>
                <div>
                  <Label htmlFor="sport">Loại Thể Thao</Label>
                  <Select
                    value={newCourtDetails.sportType}
                    onValueChange={(value) => setNewCourtDetails({ ...newCourtDetails, sportType: value as SportType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SPORTS_CONFIG).map(([key, sport]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center space-x-2">
                            <span>{sport.icon}</span>
                            <span>{sport.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Mô Tả</Label>
                <Textarea
                  id="description"
                  value={newCourtDetails.description}
                  onChange={(e) => setNewCourtDetails({ ...newCourtDetails, description: e.target.value })}
                  placeholder="Mô tả cơ sở vật chất sân của bạn..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Địa Chỉ</Label>
                  <Input
                    id="address"
                    value={newCourtDetails.address}
                    onChange={(e) => setNewCourtDetails({ ...newCourtDetails, address: e.target.value })}
                    placeholder="123 Đường Thể Thao"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Thành Phố</Label>
                  <Input
                    id="city"
                    value={newCourtDetails.city}
                    onChange={(e) => setNewCourtDetails({ ...newCourtDetails, city: e.target.value })}
                    placeholder="Hà Nội"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="rate">Giá Theo Giờ (VND)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={newCourtDetails.hourlyRate}
                  onChange={(e) => setNewCourtDetails({ ...newCourtDetails, hourlyRate: Number(e.target.value) })}
                  placeholder="200000"
                />
              </div>
              <Button onClick={handleSaveCourt} className="w-full">
                {editingCourtId ? "Lưu Thay Đổi" : "Thêm Sân"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ownerCourts.map((court) => {
          const sportConfig = SPORTS_CONFIG[court.sportType]
          return (
            <Card key={court.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={court.images[0] || "/placeholder.svg"}
                  alt={court.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="text-white border-0" style={{ backgroundColor: sportConfig.color }}>
                    {sportConfig.icon} {sportConfig.name}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {court.rating || "Mới"}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{court.name}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {court.location.address}, {court.location.city}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{court.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    <span className="font-medium">{formatVND(court.pricing.hourlyRate)}/giờ</span>
                  </div>
                  <div className="text-sm text-gray-600">{court.reviewCount} đánh giá</div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-transparent"
                    onClick={() => handleEditCourt(court.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Chỉnh Sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCourt(court.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {ownerCourts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sân nào</h3>
            <p className="text-gray-600 mb-4">Thêm sân đầu tiên của bạn để bắt đầu nhận đặt chỗ</p>
            <Button onClick={handleAddCourt}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Sân Đầu Tiên Của Bạn
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
