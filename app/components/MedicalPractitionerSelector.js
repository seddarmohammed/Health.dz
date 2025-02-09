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

const MedicalPractitionerSelector = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [ranks, setRanks] = useState([]);

  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedRank, setSelectedRank] = useState("");

  // Fetch main categories on component mount
  useEffect(() => {
    fetch("/api/getMainCategories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // Fetch sub-categories when main category changes
  useEffect(() => {
    if (selectedMainCategory) {
      fetch(`/api/getSubCategories?mainCategory=${encodeURIComponent(selectedMainCategory)}`)
        .then((res) => res.json())
        .then((data) => {
          setSubCategories(data);
          // If no subcategories exist, fetch ranks directly
          if (!data.length) {
            fetchRanks(selectedMainCategory);
          }
        });
      setSelectedSubCategory("");
      setSelectedRank("");
    }
  }, [selectedMainCategory]);

  // Fetch ranks when sub-category changes
  const fetchRanks = (mainCategory, subCategory = null) => {
    const queryParams = new URLSearchParams({
      mainCategory: mainCategory,
      ...(subCategory && { subCategory: subCategory }),
    });

    fetch(`/api/getRanks?${queryParams}`)
      .then((res) => res.json())
      .then((data) => {
        // Filter out ranks with empty or invalid values
        const validRanks = data.filter((rank) => rank.rank && rank.rank.trim() !== "");
        setRanks(validRanks);
      });
  };

  useEffect(() => {
    if (selectedMainCategory && selectedSubCategory) {
      fetchRanks(selectedMainCategory, selectedSubCategory);
      setSelectedRank("");
    }
  }, [selectedMainCategory, selectedSubCategory]);

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          نظام اختيار الممارسين الطبيين
        </h1>

        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardContent className="p-6 space-y-6">
            {/* Main Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="mainCategory" className="text-lg font-semibold">
                التصنيف الرئيسي
              </Label>
              <Select
                value={selectedMainCategory}
                onValueChange={setSelectedMainCategory}
              >
                <SelectTrigger id="mainCategory" className="w-full text-right">
                  <SelectValue placeholder="اختر التصنيف الرئيسي" />
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
            {subCategories.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="subCategory" className="text-lg font-semibold">
                  التصنيف الفرعي
                </Label>
                <Select
                  value={selectedSubCategory}
                  onValueChange={setSelectedSubCategory}
                >
                  <SelectTrigger id="subCategory" className="w-full text-right">
                    <SelectValue placeholder="اختر التصنيف الفرعي" />
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
              <div className="space-y-2">
                <Label htmlFor="rank" className="text-lg font-semibold">
                  الدرجة
                </Label>
                <Select value={selectedRank} onValueChange={setSelectedRank}>
                  <SelectTrigger id="rank" className="w-full text-right">
                    <SelectValue placeholder="اختر الدرجة" />
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