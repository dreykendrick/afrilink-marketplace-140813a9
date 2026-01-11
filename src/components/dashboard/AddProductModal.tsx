import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Loader2, ImagePlus, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

const categories = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Beauty',
  'Sports',
  'Books',
  'Toys',
  'Food & Beverages',
  'Health',
  'Other'
];

const MAX_IMAGES = 5;

interface FormData {
  title: string;
  description: string;
  price: string;
  commission: string;
  category: string;
  image_urls: string[];
}

const initialFormData: FormData = {
  title: '',
  description: '',
  price: '',
  commission: '10',
  category: '',
  image_urls: []
};

export const AddProductModal = ({ isOpen, onClose, onProductAdded }: AddProductModalProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  // Store image previews separately to persist across re-renders
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Small delay to allow animation to complete before resetting
      const timer = setTimeout(() => {
        setFormData(initialFormData);
        setImagePreviews([]);
        setIsLoading(false);
        setIsUploading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log('=== IMAGE UPLOAD START ===', { filesCount: files?.length });
    
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    const currentImageCount = imagePreviews.length;
    const remainingSlots = MAX_IMAGES - currentImageCount;
    console.log('Remaining slots:', remainingSlots);
    
    if (remainingSlots <= 0) {
      toast({
        title: 'Maximum images reached',
        description: `You can only upload up to ${MAX_IMAGES} images`,
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      // Get user session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Session check:', { hasSession: !!session, error: sessionError?.message });
      
      if (sessionError || !session?.user) {
        // Try to refresh session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshData.session?.user) {
          toast({
            title: 'Not authenticated',
            description: 'Please log in to upload images',
            variant: 'destructive'
          });
          setIsUploading(false);
          return;
        }
      }

      const userId = session?.user?.id || (await supabase.auth.getSession()).data.session?.user?.id;
      
      if (!userId) {
        toast({
          title: 'Not authenticated',
          description: 'Please log in to upload images',
          variant: 'destructive'
        });
        setIsUploading(false);
        return;
      }

      // Filter and validate files
      const validFiles = Array.from(files).slice(0, remainingSlots).filter(file => {
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Invalid file',
            description: `${file.name} is not an image`,
            variant: 'destructive'
          });
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: `${file.name} is larger than 5MB`,
            variant: 'destructive'
          });
          return false;
        }
        return true;
      });

      console.log('Valid files to upload:', validFiles.length);

      if (validFiles.length === 0) {
        setIsUploading(false);
        return;
      }

      // Upload all images
      const uploadedUrls: string[] = [];
      
      for (const file of validFiles) {
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        console.log('Uploading file:', fileName);

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: 'Upload failed',
            description: uploadError.message || 'Failed to upload image',
            variant: 'destructive'
          });
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        console.log('Uploaded successfully:', publicUrl);
        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        // Update state with new images
        setFormData(prev => {
          const newUrls = [...prev.image_urls, ...uploadedUrls];
          console.log('Updated image_urls:', newUrls);
          return { ...prev, image_urls: newUrls };
        });
        
        setImagePreviews(prev => {
          const newPreviews = [...prev, ...uploadedUrls];
          console.log('Updated imagePreviews:', newPreviews);
          return newPreviews;
        });

        toast({
          title: 'Images uploaded!',
          description: `${uploadedUrls.length} image(s) ready`
        });
      }
    } catch (error: any) {
      console.error('Image upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload images',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      // Clear the input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [imagePreviews.length, toast]);

  const removeImage = useCallback((index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) {
      console.log('Already loading, preventing duplicate submission');
      return;
    }
    
    console.log('=== PRODUCT SUBMIT START ===');
    console.log('Form data:', formData);
    console.log('Image previews:', imagePreviews);
    
    // Validate required fields
    const missingFields: string[] = [];
    if (!formData.title?.trim()) missingFields.push('Title');
    if (!formData.price || parseFloat(formData.price) <= 0) missingFields.push('Price');
    if (!formData.category) missingFields.push('Category');
    
    if (missingFields.length > 0) {
      console.log('Validation failed - missing fields:', missingFields);
      toast({
        title: 'Missing fields',
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    console.log('Loading state set to true');

    try {
      // Get current session
      console.log('Getting session...');
      let { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Initial session check:', { 
        hasSession: !!session, 
        userId: session?.user?.id, 
        error: sessionError?.message 
      });
      
      // If session error or no session, try to refresh
      if (sessionError || !session?.user) {
        console.log('Session issue, attempting refresh...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshData.session?.user) {
          console.error('Session refresh failed:', refreshError);
          toast({
            title: 'Session expired',
            description: 'Please log in again to add products',
            variant: 'destructive'
          });
          setIsLoading(false);
          return;
        }
        
        session = refreshData.session;
        console.log('Session refreshed successfully:', session.user.id);
      }

      const userId = session.user.id;
      console.log('Proceeding with user ID:', userId);

      // Prepare product data
      const priceValue = parseFloat(formData.price);
      const commissionValue = parseInt(formData.commission) || 10;
      
      // Use imagePreviews as fallback if formData.image_urls is empty
      const imageUrls = formData.image_urls.length > 0 ? formData.image_urls : imagePreviews;
      
      const productData = {
        vendor_id: userId,
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        price: Math.round(priceValue * 100),
        commission: commissionValue,
        category: formData.category,
        image_url: imageUrls[0] || null,
        image_urls: imageUrls.length > 0 ? imageUrls : null,
        status: 'pending'
      };
      
      console.log('Inserting product with data:', JSON.stringify(productData));

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      console.log('Insert response:', { success: !!data, error: error?.message });

      if (error) {
        console.error('Product insert failed:', error);
        throw new Error(error.message || 'Failed to create product');
      }

      console.log('=== PRODUCT CREATED SUCCESSFULLY ===', data.id);

      toast({
        title: 'Product added!',
        description: 'Your product is pending review'
      });

      // Close modal and notify parent
      onProductAdded();
      onClose();
    } catch (error: any) {
      console.error('=== PRODUCT SUBMIT ERROR ===', error);
      toast({
        title: 'Error adding product',
        description: error.message || 'Failed to add product. Please try again.',
        variant: 'destructive'
      });
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  };

  const triggerFileInput = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Triggering file input');
    // Use setTimeout to ensure the event is properly handled on mobile
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 100);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 bg-card border-b border-border p-4 sm:p-6 z-10">
          <DialogTitle className="text-lg sm:text-xl font-bold">Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Hidden file input - placed outside of buttons for better mobile compatibility */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            capture={undefined}
          />

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>Product Images ({imagePreviews.length}/{MAX_IMAGES})</Label>
            
            <div className="grid grid-cols-3 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={`${preview}-${index}`} className="relative group aspect-square">
                  <img
                    src={preview}
                    alt={`Product preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity touch-manipulation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                      Main
                    </span>
                  )}
                </div>
              ))}
              
              {imagePreviews.length < MAX_IMAGES && imagePreviews.length > 0 && (
                <button
                  type="button"
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-secondary/30 transition-all duration-200 touch-manipulation active:bg-secondary/50"
                >
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Add</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            {imagePreviews.length === 0 && (
              <button
                type="button"
                onClick={triggerFileInput}
                disabled={isUploading}
                className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-secondary/30 transition-all duration-200 touch-manipulation active:bg-secondary/50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
                    <span className="text-sm text-muted-foreground">Uploading...</span>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <ImagePlus className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-foreground">Tap to upload images</span>
                      <p className="text-xs text-muted-foreground mt-1">Up to {MAX_IMAGES} images, PNG/JPG, max 5MB each</p>
                    </div>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter product title"
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your product"
              className="bg-secondary/50 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission">Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                inputMode="numeric"
                min="1"
                max="50"
                value={formData.commission}
                onChange={(e) => setFormData(prev => ({ ...prev, commission: e.target.value }))}
                placeholder="10"
                className="bg-secondary/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-secondary/50">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading || isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90 touch-manipulation"
              disabled={isLoading || isUploading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Product'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
