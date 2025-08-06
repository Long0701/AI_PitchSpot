"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { mockCourts } from "@/lib/mock-data";
import { SPORTS_CONFIG, type SportType } from "@/lib/types";
import { formatVND } from "@/lib/utils";
import { DollarSign, Edit, MapPin, Plus, Star, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type FootballType = "5" | "7" | "11" | "futsal";

interface CourtTypeCount {
  footballType: FootballType;
  count: number;
  hourlyRate: number;
}

export function CourtManagement() {
  const [ownerCourts, setOwnerCourts] = useState(
    mockCourts.filter((court) => court.ownerId === "owner1")
  );
  const [editingCourtId, setEditingCourtId] = useState<
    string | null | undefined
  >(undefined);
  const { toast } = useToast();

  const [newCourtDetails, setNewCourtDetails] = useState({
    name: "",
    description: "",
    sportType: "football" as SportType,
    courtTypes: [
      { footballType: "5", count: 1, hourlyRate: 150000 },
    ] as CourtTypeCount[],
    address: "",
    city: "",
    amenities: [] as string[],
    // Thêm cho thể thao khác (không phải football)
    numberOfCourts: 1,
    hourlyRate: 0,
  });

  const editingCourt = useMemo(() => {
    return ownerCourts.find((c) => c.id === editingCourtId) || null;
  }, [editingCourtId, ownerCourts]);

  useEffect(() => {
    if (editingCourt) {
      setNewCourtDetails({
        name: editingCourt.name,
        description: editingCourt.description,
        sportType: editingCourt.sportType,
        courtTypes:
          editingCourt.sportType === "football" &&
          editingCourt.courtTypes &&
          editingCourt.courtTypes.length > 0
            ? editingCourt.courtTypes
            : [{ footballType: "5", count: 1, hourlyRate: 150000 }],
        address: editingCourt.location?.address || "",
        city: editingCourt.location?.city || "",
        amenities: editingCourt.amenities || [],
        numberOfCourts:
          editingCourt.sportType === "football"
            ? editingCourt.courtTypes?.reduce((a, c) => a + c.count, 0) || 1
            : (editingCourt as any).numberOfCourts || 1,
        hourlyRate:
          editingCourt.sportType === "football"
            ? Math.round(
                (editingCourt.courtTypes?.reduce(
                  (sum, c) => sum + c.count * c.hourlyRate,
                  0
                ) || 0) /
                  (editingCourt.courtTypes?.reduce((a, c) => a + c.count, 0) ||
                    1)
              )
            : editingCourt.pricing.hourlyRate || 150000,
      });
    } else {
      setNewCourtDetails({
        name: "",
        description: "",
        sportType: "football",
        courtTypes: [{ footballType: "5", count: 1, hourlyRate: 150000 }],
        address: "",
        city: "",
        amenities: [],
        numberOfCourts: 1,
        hourlyRate: 150000,
      });
    }
  }, [editingCourtId]);

  const handleAddCourtType = () => {
    setNewCourtDetails({
      ...newCourtDetails,
      courtTypes: [
        ...newCourtDetails.courtTypes,
        { footballType: "5", count: 1, hourlyRate: 150000 },
      ],
    });
  };

  const handleRemoveCourtType = (index: number) => {
    const newTypes = [...newCourtDetails.courtTypes];
    newTypes.splice(index, 1);
    setNewCourtDetails({ ...newCourtDetails, courtTypes: newTypes });
  };

  const handleChangeCourtType = (
    index: number,
    field: "footballType" | "count" | "hourlyRate",
    value: any
  ) => {
    const newTypes = [...newCourtDetails.courtTypes];
    if (field === "count") {
      newTypes[index].count = Math.max(1, Number(value));
    } else if (field === "hourlyRate") {
      newTypes[index].hourlyRate = Math.max(0, Number(value));
    } else {
      newTypes[index].footballType = value;
    }
    setNewCourtDetails({ ...newCourtDetails, courtTypes: newTypes });
  };

  const handleSaveCourt = () => {
    const isEditing =
      editingCourtId !== null &&
      editingCourtId !== undefined &&
      editingCourtId !== "";

    const id = isEditing ? editingCourtId! : `court-${Date.now()}`;

    let courtTypesToSave =
      newCourtDetails.sportType === "football"
        ? newCourtDetails.courtTypes
        : undefined;

    // Tính giá trung bình để hiển thị trong pricing (có thể dùng để filter)
    let avgPrice = 0;
    if (newCourtDetails.sportType === "football" && courtTypesToSave) {
      const totalCount = courtTypesToSave.reduce((a, c) => a + c.count, 0);
      const totalPrice = courtTypesToSave.reduce(
        (sum, c) => sum + c.count * c.hourlyRate,
        0
      );
      avgPrice = totalCount > 0 ? Math.round(totalPrice / totalCount) : 0;
    } else {
      avgPrice = newCourtDetails.hourlyRate;
    }

    const court = {
      id,
      name: newCourtDetails.name,
      description: newCourtDetails.description,
      sportType: newCourtDetails.sportType,
      courtTypes: courtTypesToSave,
      location: {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.006 + (Math.random() - 0.5) * 0.1,
        address: newCourtDetails.address,
        city: newCourtDetails.city,
      },
      pricing: {
        hourlyRate: avgPrice,
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
      numberOfCourts:
        newCourtDetails.sportType === "football"
          ? newCourtDetails.courtTypes.reduce((a, c) => a + c.count, 0)
          : newCourtDetails.numberOfCourts,
    };

    const updatedCourts = isEditing
      ? ownerCourts.map((c) => (c.id === court.id ? court : c))
      : [...ownerCourts, court];

    setOwnerCourts(updatedCourts);
    setEditingCourtId(undefined);

    toast({
      title: isEditing ? "Cập nhật sân thành công" : "Thêm sân mới thành công!",
      description: `${court.name} đã được ${isEditing ? "cập nhật" : "tạo"}.`,
    });
  };

  const handleDeleteCourt = (courtId: string) => {
    setOwnerCourts(ownerCourts.filter((court) => court.id !== courtId));
    toast({
      title: "Đã xóa sân",
      description: "Sân đã được gỡ khỏi danh sách của bạn.",
    });
  };

  const handleEditCourt = (courtId: string) => {
    setEditingCourtId(courtId);
  };

  const handleAddCourt = () => {
    setEditingCourtId("");
  };

  const handleCloseModal = () => {
    setEditingCourtId(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sân Của Tôi</h2>
          <p className="text-gray-600">
            Quản lý các sân thể thao và cơ sở vật chất của bạn
          </p>
        </div>
        <Button onClick={handleAddCourt}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm Sân
        </Button>
        <Dialog
          open={editingCourtId !== undefined}
          onOpenChange={handleCloseModal}
        >
          <DialogContent className="w-[1000px]">
            <DialogHeader>
              <DialogTitle>
                {editingCourtId ? "Chỉnh Sửa Sân" : "Thêm Sân Mới"}
              </DialogTitle>
              {/* <DialogDescription>
                {editingCourtId
                  ? "Cập nhật thông tin sân thể thao của bạn"
                  : "Tạo một danh sách sân mới cho cơ sở của bạn"}
              </DialogDescription> */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <div className="flex items-center space-x-2 w-full">
                  <div className="w-[200%]">
                    <Label htmlFor="name" className="mb-2">
                      Tên Sân
                    </Label>
                    <Input
                      id="name"
                      value={newCourtDetails.name}
                      onChange={(e) =>
                        setNewCourtDetails({
                          ...newCourtDetails,
                          name: e.target.value,
                        })
                      }
                      placeholder="Khu Liên Hợp Thể Thao Trung Tâm"
                    />
                  </div>

                  <div className="w-full">
                    <Label htmlFor="sport" className="mb-2">
                      Loại Thể Thao
                    </Label>
                    <Select
                      value={newCourtDetails.sportType}
                      onValueChange={(value) => {
                        if (value === "football") {
                          setNewCourtDetails({
                            ...newCourtDetails,
                            sportType: value as SportType,
                            courtTypes: [
                              {
                                footballType: "5",
                                count: 1,
                                hourlyRate: 150000,
                              },
                            ],
                            numberOfCourts: 1,
                            hourlyRate: 150000,
                          });
                        } else {
                          setNewCourtDetails({
                            ...newCourtDetails,
                            sportType: value as SportType,
                            courtTypes: [],
                            numberOfCourts: 1,
                            hourlyRate: 150000,
                          });
                        }
                      }}
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
              </div>

              {/* Nếu là bóng đá thì hiển thị quản lý nhiều loại sân */}
              {newCourtDetails.sportType === "football" ? (
                <div>
                  <Label className="mb-2">
                    Danh sách loại sân, số lượng và giá theo giờ
                  </Label>
                  <div className="space-y-2 w-full">
                    {newCourtDetails.courtTypes.map((ct, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 w-full"
                      >
                        <Select
                          value={ct.footballType}
                          onValueChange={(val) =>
                            handleChangeCourtType(idx, "footballType", val)
                          }
                        >
                          <SelectTrigger className="w-1/2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">Sân 5 người</SelectItem>
                            <SelectItem value="7">Sân 7 người</SelectItem>
                            <SelectItem value="11">Sân 11 người</SelectItem>
                            <SelectItem value="futsal">Sân Futsal</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input
                          type="number"
                          min={1}
                          className="w-1/6"
                          value={ct.count}
                          onChange={(e) =>
                            handleChangeCourtType(idx, "count", e.target.value)
                          }
                          placeholder="Số sân"
                        />

                        <Input
                          type="number"
                          min={0}
                          className="w-32"
                          value={ct.hourlyRate}
                          onChange={(e) =>
                            handleChangeCourtType(
                              idx,
                              "hourlyRate",
                              e.target.value
                            )
                          }
                          placeholder="Giá theo giờ (VND)"
                        />

                        {newCourtDetails.courtTypes.length > 1 && (
                          <Button
                            variant="outline"
                            onClick={() => handleRemoveCourtType(idx)}
                          >
                            Xóa
                          </Button>
                        )}
                      </div>
                    ))}

                    {newCourtDetails.courtTypes.length < 4 && (
                      <Button
                        size="sm"
                        onClick={handleAddCourtType}
                        className="mt-2"
                      >
                        Thêm Loại Sân
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Nếu không phải bóng đá thì chỉ có số sân và giá theo giờ */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="numberOfCourts">Số sân</Label>
                      <Input
                        id="numberOfCourts"
                        type="number"
                        min={1}
                        value={newCourtDetails.numberOfCourts}
                        onChange={(e) =>
                          setNewCourtDetails({
                            ...newCourtDetails,
                            numberOfCourts: Math.max(1, Number(e.target.value)),
                          })
                        }
                        placeholder="Số lượng sân"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hourlyRate">Giá theo giờ (VND)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min={0}
                        value={newCourtDetails.hourlyRate}
                        onChange={(e) =>
                          setNewCourtDetails({
                            ...newCourtDetails,
                            hourlyRate: Math.max(0, Number(e.target.value)),
                          })
                        }
                        placeholder="Giá theo giờ"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="description" className="mb-2">
                  Mô Tả
                </Label>
                <Textarea
                  id="description"
                  value={newCourtDetails.description}
                  onChange={(e) =>
                    setNewCourtDetails({
                      ...newCourtDetails,
                      description: e.target.value,
                    })
                  }
                  placeholder="Mô tả cơ sở vật chất sân của bạn..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address" className="mb-2">
                    Địa Chỉ
                  </Label>
                  <Input
                    id="address"
                    value={newCourtDetails.address}
                    onChange={(e) =>
                      setNewCourtDetails({
                        ...newCourtDetails,
                        address: e.target.value,
                      })
                    }
                    placeholder="123 Đường Thể Thao"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="mb-2">
                    Thành Phố
                  </Label>
                  <Input
                    id="city"
                    value={newCourtDetails.city}
                    onChange={(e) =>
                      setNewCourtDetails({
                        ...newCourtDetails,
                        city: e.target.value,
                      })
                    }
                    placeholder="Hà Nội"
                  />
                </div>
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
        {ownerCourts.map((court: (typeof mockCourts)[number]) => {
          const sportConfig = SPORTS_CONFIG[court.sportType as SportType];
          const totalCourts =
            court.sportType === "football" && court.courtTypes
              ? court.courtTypes.reduce((a, c) => a + c.count, 0)
              : (court as any).numberOfCourts || 1;
          return (
            <Card key={court.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={court.images[0] || "/placeholder.svg"}
                  alt={court.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    className="text-white border-0"
                    style={{ backgroundColor: sportConfig.color }}
                  >
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
                <p className="text-sm text-gray-600 line-clamp-2">
                  {court.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-1 text-green-600" />
                    <span className="font-medium">
                      {formatVND(court.pricing.hourlyRate)}/giờ (trung bình)
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {court.reviewCount} đánh giá
                  </div>
                </div>

                <div className="text-sm text-gray-700">
                  Tổng số sân: <b>{totalCourts}</b>
                  {court.sportType === "football" && court.courtTypes && (
                    <>
                      <br />
                      Chi tiết:
                      <ul className="list-disc list-inside">
                        {court.courtTypes.map((ct, idx) => (
                          <li key={idx}>
                            Sân {ct.footballType} người: {ct.count} sân - Giá:{" "}
                            {formatVND(ct.hourlyRate)}/giờ
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
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
          );
        })}
      </div>

      {ownerCourts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có sân nào
            </h3>
            <p className="text-gray-600 mb-4">
              Thêm sân đầu tiên của bạn để bắt đầu nhận đặt chỗ
            </p>
            <Button onClick={handleAddCourt}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm Sân Đầu Tiên Của Bạn
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
