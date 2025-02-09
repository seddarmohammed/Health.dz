import React, { useEffect, useState } from "react";
import SalaryCalculation from "./SalaryCalculation";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

const MedicalPractitionerSelector = () => {
  const [showSalaryCalculation, setShowSalaryCalculation] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState({
    categories: true,
    subCategories: false,
    ranks: false,
  });

  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedRank, setSelectedRank] = useState("");
  const [experience, setExperience] = useState("");
  const [contagionAllowance, setContagionAllowance] = useState("");

  const CONTAGION_ALLOWANCE_OPTIONS = [
    { value: "0", label: "0" },
    { value: "2500", label: "2,500" },
    { value: "4000", label: "4,000" },
    { value: "5800", label: "5,800" },
    { value: "7200", label: "7,200" },
  ];

  // Check if current step selections are complete
  const isStepOneComplete = selectedMainCategory &&
    (subCategories.length === 0 || selectedSubCategory ||
      (subCategories.length === 1 && subCategories[0].subCategory === selectedMainCategory));

  const isStepTwoComplete = experience !== "" && contagionAllowance !== "";

  // Handle experience input
  const handleExperienceChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 12)) {
      setExperience(value);
    }
  };

  // Fetch main categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/getMainCategories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, categories: false }));
      }
    };
    fetchCategories();
  }, []);

  // Handle main category selection
  const handleMainCategoryChange = async (value) => {
    setSelectedMainCategory(value);
    setSelectedSubCategory("");
    setSelectedRank("");
    setRanks([]);

    if (!value) return;

    setIsLoading(prev => ({ ...prev, subCategories: true }));
    try {
      const response = await fetch(`/api/getSubCategories?mainCategory=${encodeURIComponent(value)}`);
      const data = await response.json();
      setSubCategories(data);

      // If subcategory matches main category, fetch ranks directly
      if (data.length === 1 && data[0].subCategory === value) {
        await fetchRanks(value, value);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, subCategories: false }));
    }
  };

  // Fetch ranks
  const fetchRanks = async (mainCategory, subCategory) => {
    setIsLoading(prev => ({ ...prev, ranks: true }));
    try {
      const queryParams = new URLSearchParams({
        mainCategory,
        subCategory,
      });
      const response = await fetch(`/api/getRanks?${queryParams}`);
      const data = await response.json();
      setRanks(data.filter(rank => rank.rank && rank.rank.trim() !== ""));
    } catch (error) {
      console.error("Error fetching ranks:", error);
    } finally {
      setIsLoading(prev => ({ ...prev, ranks: false }));
    }
  };

  // Handle subcategory selection
  const handleSubCategoryChange = (value) => {
    setSelectedSubCategory(value);
    setSelectedRank("");
    if (value) {
      fetchRanks(selectedMainCategory, value);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    setShowSalaryCalculation(true);
  };

  if (showSalaryCalculation) {
    return (
      <SalaryCalculation
        formData={{
          mainCategory: selectedMainCategory,
          subCategory: selectedSubCategory,
          rank: selectedRank,
          experience,
          contagionAllowance
        }}
        onBack={() => setShowSalaryCalculation(false)}
      />
    );
  }

  if (showSalaryCalculation) {
    return (
      <SalaryCalculation
        formData={{
          mainCategory: selectedMainCategory,
          subCategory: selectedSubCategory,
          rank: selectedRank,
          experience,
          contagionAllowance
        }}
        onBack={() => setShowSalaryCalculation(false)}
      />
    );
  }

  // Handle navigation
  const handleNext = () => {
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12" dir="rtl">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Cairo', sans-serif;
        }
      `}</style>

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            نظام اختيار الممارسين الطبيين
          </h1>
          <p className="text-lg text-gray-600">
            الخطوة {currentStep} من 2
          </p>
        </div>

        <Card className="w-full max-w-2xl mx-auto shadow-xl bg-white/80 backdrop-blur">
          <CardContent className="p-8">
            {currentStep === 1 ? (
              <div className="space-y-8">
                {/* Main Category Selection */}
                <div className="space-y-3">
                  <Label htmlFor="mainCategory" className="text-lg font-semibold text-gray-900">
                    التصنيف الرئيسي
                  </Label>
                  <Select
                    value={selectedMainCategory}
                    onValueChange={handleMainCategoryChange}
                    disabled={isLoading.categories}
                  >
                    <SelectTrigger id="mainCategory" className="w-full text-right h-12">
                      <SelectValue placeholder="اختر التصنيف الرئيسي" />
                      {isLoading.categories && (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.mainCategory}
                          value={category.mainCategory}
                          className="text-right"
                        >
                          {category.mainCategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub Category Selection */}
                {subCategories.length > 0 && subCategories[0].subCategory !== selectedMainCategory && (
                  <div className="space-y-3">
                    <Label htmlFor="subCategory" className="text-lg font-semibold text-gray-900">
                      التصنيف الفرعي
                    </Label>
                    <Select
                      value={selectedSubCategory}
                      onValueChange={handleSubCategoryChange}
                      disabled={isLoading.subCategories}
                    >
                      <SelectTrigger id="subCategory" className="w-full text-right h-12">
                        <SelectValue placeholder="اختر التصنيف الفرعي" />
                        {isLoading.subCategories && (
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories.map((subCategory) => (
                          <SelectItem
                            key={subCategory.subCategory}
                            value={subCategory.subCategory}
                            className="text-right"
                          >
                            {subCategory.subCategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Rank Selection */}
                {ranks.length > 0 && (
                  <div className="space-y-3">
                    <Label htmlFor="rank" className="text-lg font-semibold text-gray-900">
                      الدرجة
                    </Label>
                    <Select
                      value={selectedRank}
                      onValueChange={setSelectedRank}
                      disabled={isLoading.ranks}
                    >
                      <SelectTrigger id="rank" className="w-full text-right h-12">
                        <SelectValue placeholder="اختر الدرجة" />
                        {isLoading.ranks && (
                          <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {ranks.map((rank) => (
                          <SelectItem
                            key={rank.rank}
                            value={rank.rank}
                            className="text-right"
                          >
                            {rank.rank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {/* Summary of Step 1 */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-gray-600">التصنيف الرئيسي: <span className="font-semibold text-gray-900">{selectedMainCategory}</span></p>
                  {selectedSubCategory && (
                    <p className="text-gray-600">التصنيف الفرعي: <span className="font-semibold text-gray-900">{selectedSubCategory}</span></p>
                  )}
                  <p className="text-gray-600">الدرجة: <span className="font-semibold text-gray-900">{selectedRank}</span></p>
                </div>

                {/* Professional Experience Input */}
                <div className="space-y-3">
                  <Label htmlFor="experience" className="text-lg font-semibold text-gray-900">
                    الخبرة المهنية (بالسنوات)
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    max="12"
                    value={experience}
                    onChange={handleExperienceChange}
                    className="text-right h-12"
                    placeholder="أدخل سنوات الخبرة (0-12)"
                  />
                  {experience !== "" && (Number(experience) < 0 || Number(experience) > 12) && (
                    <p className="text-red-500 text-sm">يجب أن تكون الخبرة بين 0 و 12 سنة</p>
                  )}
                </div>

                {/* Contagion Allowance Selection */}
                <div className="space-y-3">
                  <Label htmlFor="contagionAllowance" className="text-lg font-semibold text-gray-900">
                    منحة العدوى
                  </Label>
                  <Select
                    value={contagionAllowance}
                    onValueChange={setContagionAllowance}
                  >
                    <SelectTrigger id="contagionAllowance" className="w-full text-right h-12">
                      <SelectValue placeholder="اختر قيمة منحة العدوى" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTAGION_ALLOWANCE_OPTIONS.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="text-right"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep === 2 && (
                <Button
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>
              )}
              {currentStep === 1 && (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 mr-auto"
                  disabled={!isStepOneComplete}
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              {currentStep === 2 && (
                <Button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 mr-auto"
                  disabled={!isStepTwoComplete}
                >
                  حساب الراتب
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalPractitionerSelector;