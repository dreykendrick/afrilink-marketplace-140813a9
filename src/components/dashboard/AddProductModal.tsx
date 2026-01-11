import { useState, useRef } from 'react';
import { X, Upload, Loader2, ImagePlus, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export const AddProductModal = ({ isOpen, onClose, onProductAdded }: AddProductModalProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    commission: '10',
    category: '',
    image_urls: [] as string[]
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - imagePreviews.length;
    if (remainingSlots <= 0) {
      toast({
        title: 'Maximum images reached',
        description: `You can only upload up to ${MAX_IMAGES} images`,
        variant: 'destructive'
      });
      return;
    }

    // Get user once before uploads
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Not authenticated',
        description: 'Please log in to upload images',
        variant: 'destructive'
      });
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

    if (validFiles.length === 0) return;

    setIsUploading(true);

    // Upload all images in parallel
    const uploadPromises = validFiles.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    try {
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({ 
        ...prev, 
        image_urls: [...prev.image_urls, ...uploadedUrls] 
      }));
      setImagePreviews(prev => [...prev, ...uploadedUrls]);

      toast({
        title: 'Images uploaded!',
        description: `${uploadedUrls.length} image(s) ready`
      });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload images',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent double-tap issues on mobile
    if (isLoading) {
      console.log('Already loading, preventing duplicate submission');
      return;
    }
    
    console.log('=== PRODUCT SUBMIT START ===');
    console.log('Form data:', formData);
    
    // Validate required fields with better feedback
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
      // Get current session - critical for mobile where sessions can expire
      console.log('Getting session...');
      let { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('Initial session check:', { 
        hasSession: !!session, 
        userId: session?.user?.id, 
        error: sessionError?.message 
      });
      
      // If session error, try to refresh
      if (sessionError) {
        console.log('Session error, attempting refresh...');
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
        console.log('Session refreshed successfully');
      }
      
      // If still no session, try one more refresh
      if (!session?.user) {
        console.log('No session found, attempting refresh...');
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

      // Prepare product data - ensure all values are properly formatted
      const priceValue = parseFloat(formData.price);
      const commissionValue = parseInt(formData.commission) || 10;
      
      const productData = {
        vendor_id: userId,
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        price: Math.round(priceValue * 100),
        commission: commissionValue,
        category: formData.category,
        image_url: formData.image_urls[0] || null,
        image_urls: formData.image_urls.length > 0 ? formData.image_urls : null,
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

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        commission: '10',
        category: '',
        image_urls: []
      });
      setImagePreviews([]);
      
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
        onTouchEnd={(e) => {
          // Only close if the touch target is the backdrop itself
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      />
      
      <div 
        className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-t-2xl sm:rounded-2xl border border-border shadow-xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border p-4 sm:p-6 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Add New Product</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors touch-manipulation"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label>Product Images ({imagePreviews.length}/{MAX_IMAGES})</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            
            <div className="grid grid-cols-3 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={preview}
                    alt={`Product preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-xl border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
              
              {imagePreviews.length < MAX_IMAGES && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }}
                  onTouchEnd={(e) => e.stopPropagation()}
                  disabled={isUploading}
                  className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-secondary/30 transition-all duration-200 touch-manipulation"
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
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  fileInputRef.current?.click();
                }}
                onTouchEnd={(e) => e.stopPropagation()}
                disabled={isUploading}
                className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-secondary/30 transition-all duration-200 touch-manipulation"
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
                      <span className="text-sm font-medium text-foreground">Click to upload images</span>
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter product title"
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="bg-secondary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission">Commission (%)</Label>
              <Input
                id="commission"
                type="number"
                min="1"
                max="50"
                value={formData.commission}
                onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                placeholder="10"
                className="bg-secondary/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
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
              onClick={(e) => {
                // Ensure button click triggers form submit on mobile
                console.log('Submit button clicked');
              }}
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
      </div>
    </div>
  );
};