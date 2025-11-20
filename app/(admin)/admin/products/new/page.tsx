"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SingleProductForm } from "@/components/admin/dashboard/single-product-form";
import { BulkProductUpload } from "@/components/admin/dashboard/bulk-product-upload";
import { motion } from "framer-motion";

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] = useState("single");

  return (
    <div className="min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-4xl font-serif text-foreground">
            {"Add Products"}
          </h1>
          <p className="text-muted-foreground">
            {
              "Add new products to your Revival Glow catalog either one at a time or in bulk via CSV."
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{"Product Management"}</CardTitle>
            <CardDescription>
              {
                "Choose between adding a single product or uploading multiple products via CSV file."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single">{"Single Product"}</TabsTrigger>
                <TabsTrigger value="bulk">{"Bulk Upload (CSV)"}</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="mt-2">
                <SingleProductForm />
              </TabsContent>

              <TabsContent value="bulk" className="mt-2">
                <BulkProductUpload />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
