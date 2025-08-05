"use client"
import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { SPORTS_CONFIG, UserRole } from "@/lib/types" // Import UserRole enum
import { MapPin, Zap, Users } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"

export function LandingPage() {
  const { login, register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as UserRole // Use UserRole enum

    try {
      await login(email, password, role)
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as UserRole // Use UserRole enum

    try {
      await register(name, email, password, role)
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm flex items-center justify-between">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SS</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                SmartSport
              </span>
            </div>
          </div>
        </div>
        <Button
          type="submit"
          className="w-fit mr-4"
          onClick={() => setIsAuthModalOpen(true)}
        >
          Đăng Nhập
        </Button>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Đặt Sân Thể Thao
              <span className="text-primary block">
                Thông Minh & Nhanh Chóng
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Tìm và đặt sân thể thao với tình trạng trống theo thời gian thực,
              dự báo thời tiết và gợi ý từ AI. Hoàn hảo cho người dùng và chủ
              sân.
            </p>

            {/* Sports Icons */}
            <div className="flex justify-center space-x-4 mb-12">
              {Object.entries(SPORTS_CONFIG).map(([key, sport]) => (
                <div key={key} className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-2"
                    style={{ backgroundColor: sport.color }}
                  >
                    {sport.icon}
                  </div>
                  <span className="text-sm text-gray-600">{sport.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card>
              <CardHeader>
                <MapPin className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Tìm Kiếm Vị Trí Thông Minh</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Tìm sân gần bạn với bản đồ tương tác và tình trạng trống theo
                  thời gian thực.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Tích Hợp Thời Tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nhận dự báo thời tiết cho thời gian đặt sân và tránh thời tiết
                  xấu.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Gợi Ý AI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nhận đề xuất cá nhân hóa dựa trên sở thích và lịch sử của bạn.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Auth Section */}
          <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">Bắt Đầu</DialogTitle>
                <DialogDescription className="text-center">
                  Tham gia SmartSport với tư cách người dùng hoặc chủ sân
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="login" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Đăng Nhập</TabsTrigger>
                  <TabsTrigger value="register">Đăng Ký</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-password">Mật Khẩu</Label>
                      <Input
                        id="login-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-role">Tôi là</Label>
                      <select
                        id="login-role"
                        name="role"
                        className="w-full p-2 border rounded-md"
                        required
                      >
                        <option value={UserRole.Player}>Người Dùng</option>
                        <option value={UserRole.Owner}>Chủ Sân</option>
                      </select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <Label htmlFor="register-name">Họ Tên</Label>
                      <Input
                        id="register-name"
                        name="name"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-password">Mật Khẩu</Label>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-role">Tôi là</Label>
                      <select
                        id="register-role"
                        name="role"
                        className="w-full p-2 border rounded-md"
                        required
                      >
                        <option value={UserRole.Player}>Người Dùng</option>
                        <option value={UserRole.Owner}>Chủ Sân</option>
                      </select>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang tạo tài khoản..." : "Tạo Tài Khoản"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}
