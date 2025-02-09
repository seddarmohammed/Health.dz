// SalaryCalculation.js
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const SalaryCalculation = ({ formData, onBack }) => {
    const {
        mainCategory,
        subCategory,
        rank,
        experience,
        contagionAllowance
    } = formData;

    // Calculate basic salary (this is a placeholder - replace with actual calculation logic)
    const calculateBasicSalary = () => {
        // Example calculation - replace with actual logic
        const baseSalary = 10000; // Base amount
        const experienceBonus = Number(experience) * 500; // 500 per year of experience
        return baseSalary + experienceBonus;
    };

    const basicSalary = calculateBasicSalary();
    const totalSalary = basicSalary + Number(contagionAllowance);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12" dir="rtl">
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Cairo', sans-serif;
        }
      `}</style>

            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <Button
                        onClick={onBack}
                        variant="outline"
                        className="mb-6"
                    >
                        <ChevronRight className="h-4 w-4 ml-2" />
                        العودة
                    </Button>

                    <Card className="shadow-xl bg-white/80 backdrop-blur">
                        <CardHeader className="text-center border-b">
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                تفاصيل الراتب
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6">
                            {/* Employee Information */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <h3 className="font-semibold text-lg mb-3">معلومات الموظف</h3>
                                <div className="grid gap-2 text-gray-600">
                                    <p>التصنيف الرئيسي: <span className="font-semibold text-gray-900">{mainCategory}</span></p>
                                    {subCategory && (
                                        <p>التصنيف الفرعي: <span className="font-semibold text-gray-900">{subCategory}</span></p>
                                    )}
                                    <p>الدرجة: <span className="font-semibold text-gray-900">{rank}</span></p>
                                    <p>سنوات الخبرة: <span className="font-semibold text-gray-900">{experience}</span></p>
                                </div>
                            </div>

                            {/* Salary Breakdown */}
                            <div className="space-y-6">
                                <h3 className="font-semibold text-lg">تفاصيل الراتب الشهري</h3>

                                <div className="space-y-4">
                                    {/* Basic Salary */}
                                    <div className="flex justify-between items-center py-3 border-b">
                                        <span className="text-gray-600">الراتب الأساسي</span>
                                        <span className="font-semibold text-gray-900">{basicSalary.toLocaleString()} ريال</span>
                                    </div>

                                    {/* Experience Allowance */}
                                    <div className="flex justify-between items-center py-3 border-b">
                                        <span className="text-gray-600">بدل الخبرة</span>
                                        <span className="font-semibold text-gray-900">{(Number(experience) * 500).toLocaleString()} ريال</span>
                                    </div>

                                    {/* Contagion Allowance */}
                                    <div className="flex justify-between items-center py-3 border-b">
                                        <span className="text-gray-600">منحة العدوى</span>
                                        <span className="font-semibold text-gray-900">{Number(contagionAllowance).toLocaleString()} ريال</span>
                                    </div>

                                    {/* Total Salary */}
                                    <div className="flex justify-between items-center py-4 bg-gray-50 rounded-lg px-4 mt-6">
                                        <span className="font-bold text-lg">إجمالي الراتب</span>
                                        <span className="font-bold text-lg text-green-600">{totalSalary.toLocaleString()} ريال</span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">ملاحظات</h4>
                                <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                                    <li>الرواتب تخضع للضرائب والاقتطاعات القانونية</li>
                                    <li>يتم احتساب منحة العدوى حسب طبيعة العمل</li>
                                    <li>قد تتغير قيمة البدلات حسب السياسات المعتمدة</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SalaryCalculation;