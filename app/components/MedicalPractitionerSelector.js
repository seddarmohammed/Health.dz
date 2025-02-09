// app\components\MedicalPractitionerSelector.js
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const MedicalPractitionerSelector = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [isLoading, setIsLoading] = useState({
    categories: true,
    subCategories: false,
    ranks: false,
  });

  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedRank, setSelectedRank] = useState("");

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            نظام اختيار الممارسين الطبيين
          </h1>
          <p className="text-lg text-gray-600">
            اختر التصنيف المناسب للحصول على المعلومات المطلوبة
          </p>
        </div>

        <Card className="w-full max-w-2xl mx-auto shadow-xl bg-white/80 backdrop-blur">
          <CardContent className="p-8 space-y-8">
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

            {/* Sub Category Selection - Only show if subcategories exist */}
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

            {/* Rank Selection - Only show if ranks exist */}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalPractitionerSelector;