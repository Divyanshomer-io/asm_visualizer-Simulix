
import React, { useState } from 'react';
import { X, MessageSquare, Mail, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface FeedbackFormProps {
  showFeedback: boolean;
  setShowFeedback: (show: boolean) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ showFeedback, setShowFeedback }) => {
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Add rating to form data
    formData.append('rating', rating.toString());
    
    // Format the message for better email readability
    const name = formData.get('name') as string;
    const organization = formData.get('organization') as string;
    const contactInfo = formData.get('contactInfo') as string;
    const profession = formData.get('profession') as string;
    const feedback = formData.get('feedback') as string;
    
    const formattedMessage = `
FEEDBACK SUBMISSION
===================

Name: ${name}
Organization/Institute: ${organization}
Contact Info: ${contactInfo || 'Not provided'}
Profession: ${profession}
Rating: ${rating}/5 stars

Feedback:
${feedback}
    `;
    
    // Replace the original feedback with formatted message
    formData.set('feedback', formattedMessage);
    
    try {
      const response = await fetch('https://formspree.io/f/mzzgzddo', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setFeedbackSubmitted(true);
        toast.success('Thank you for your feedback!');
        setTimeout(() => {
          setShowFeedback(false);
          setFeedbackSubmitted(false);
          setRating(0);
        }, 2000);
      } else {
        toast.error('Failed to send feedback. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send feedback. Please try again.');
    }
  };

  const closeFeedback = () => {
    setShowFeedback(false);
    setFeedbackSubmitted(false);
    setRating(0);
  };

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="p-1 rounded transition-colors hover:bg-accent/20"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= (hoveredRating || rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground hover:text-yellow-400'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!showFeedback) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="relative glass-panel rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl border-2 border-accent/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeFeedback}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent/20 transition-colors duration-200 group"
        >
          <X className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
        </button>

        {!feedbackSubmitted ? (
          <form onSubmit={handleFeedbackSubmit} className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/30 to-blue-500/30 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-accent via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Send Feedback
              </h2>
              <p className="text-muted-foreground">
                Help us improve Simulix with your thoughts and suggestions
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Your full name"
                  className="bg-background/50 border-white/10 focus:border-accent/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization" className="text-sm font-medium">
                  Organization/Institute <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="organization"
                  name="organization"
                  required
                  placeholder="Your organization"
                  className="bg-background/50 border-white/10 focus:border-accent/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo" className="text-sm font-medium">
                Contact Info <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                placeholder="Email or phone number"
                className="bg-background/50 border-white/10 focus:border-accent/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession" className="text-sm font-medium">
                Profession <span className="text-red-400">*</span>
              </Label>
              <Select name="profession" required>
                <SelectTrigger className="bg-background/50 border-white/10 focus:border-accent/40">
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Rating <span className="text-red-400">*</span>
              </Label>
              <div className="flex items-center gap-2">
                {renderStars()}
                <span className="text-sm text-muted-foreground ml-2">
                  {rating > 0 ? `${rating}/5` : 'Please rate your experience'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-sm font-medium">
                Feedback <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="feedback"
                name="feedback"
                required
                placeholder="Type your feedback here..."
                className="min-h-[120px] resize-none bg-background/50 border-white/10 focus:border-accent/40"
              />
            </div>

            <Button
              type="submit"
              disabled={rating === 0}
              className="w-full bg-gradient-to-r from-accent/30 to-blue-500/30 hover:from-accent/40 hover:to-blue-500/40 border border-accent/30 hover:border-accent/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send Feedback
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-400">Thank You!</h2>
            <p className="text-muted-foreground">
              Your feedback has been sent successfully. We appreciate your input!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
