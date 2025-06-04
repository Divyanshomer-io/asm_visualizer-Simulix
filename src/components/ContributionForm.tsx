
import React, { useState } from 'react';
import { X, Sparkles, Upload, FileText, Star, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ContributionFormProps {
  showContribution: boolean;
  setShowContribution: (show: boolean) => void;
}

const ContributionForm: React.FC<ContributionFormProps> = ({ showContribution, setShowContribution }) => {
  const [contributionSubmitted, setContributionSubmitted] = useState(false);
  const [contributionType, setContributionType] = useState('');

  const handleContributionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Format the message for better email readability
    const name = formData.get('name') as string;
    const organization = formData.get('organization') as string;
    const contactInfo = formData.get('contactInfo') as string;
    const type = formData.get('type') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string || 'Not provided';
    const links = formData.get('links') as string || 'Not provided';
    const notes = formData.get('notes') as string || 'Not provided';
    
    const formattedMessage = `
CONTRIBUTION SUBMISSION
======================

Name: ${name}
Organization/Institute: ${organization}
Contact Info: ${contactInfo || 'Not provided'}
Type of Contribution: ${type}
Title: ${title}

Description/Abstract:
${description}

Contribution Content:
${content}

Relevant Links: ${links}

Additional Notes: ${notes}
    `;
    
    // Replace the original description with formatted message
    formData.set('description', formattedMessage);
    
    try {
      const response = await fetch('https://formspree.io/f/mzzgzddo', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setContributionSubmitted(true);
        toast.success('Thank you for your contribution!');
        setTimeout(() => {
          setShowContribution(false);
          setContributionSubmitted(false);
          setContributionType('');
        }, 2000);
      } else {
        toast.error('Failed to send contribution. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to send contribution. Please try again.');
    }
  };

  const closeContribution = () => {
    setShowContribution(false);
    setContributionSubmitted(false);
    setContributionType('');
  };

  const requiresFileUpload = (type: string) => {
    return ['Code snippet', 'Research paper', 'Educational content'].includes(type);
  };

  if (!showContribution) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="relative glass-panel rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl border-2 border-accent/30 max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeContribution}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent/20 transition-colors duration-200 group"
        >
          <X className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
        </button>

        {!contributionSubmitted ? (
          <form 
            onSubmit={handleContributionSubmit} 
            className="space-y-6"
            encType="multipart/form-data"
          >
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent/30 to-purple-500/30 rounded-2xl flex items-center justify-center">
                  <Code className="h-6 w-6 text-accent" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-accent via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Contribute to Simulix
              </h2>
              <p className="text-muted-foreground">
                Share your code, research, or ideas to help improve Simulix
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name <span className="text-red-400">*</span>
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
              <Label htmlFor="type" className="text-sm font-medium">
                Type of Contribution <span className="text-red-400">*</span>
              </Label>
              <Select 
                name="type" 
                required 
                value={contributionType} 
                onValueChange={setContributionType}
              >
                <SelectTrigger className="bg-background/50 border-white/10 focus:border-accent/40">
                  <SelectValue placeholder="Select type of contribution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Code snippet">Code snippet</SelectItem>
                  <SelectItem value="Research paper">Research paper</SelectItem>
                  <SelectItem value="Educational content">Educational content</SelectItem>
                  <SelectItem value="Visualization idea">Visualization idea</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title of Contribution <span className="text-red-400">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Brief title for your contribution"
                className="bg-background/50 border-white/10 focus:border-accent/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description/Abstract <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Describe your contribution and its purpose..."
                className="min-h-[120px] resize-none bg-background/50 border-white/10 focus:border-accent/40"
              />
            </div>

            {requiresFileUpload(contributionType) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium">
                    Contribution Content
                  </Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Paste code or add detailed content here..."
                    className="min-h-[120px] resize-none bg-background/50 border-white/10 focus:border-accent/40 font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file" className="text-sm font-medium flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Attach from device <span className="text-muted-foreground text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".txt,.pdf,.docx,.py,.ipynb,.md,.js,.tsx,.ts,.jsx"
                    className="bg-background/50 border-white/10 focus:border-accent/40 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent hover:file:bg-accent/30"
                  />
                  <p className="text-xs text-muted-foreground">
                    If file upload fails, please provide a public link in the relevant links field below.
                  </p>
                </div>
              </>
            )}

            {!requiresFileUpload(contributionType) && contributionType && (
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Contribution Details
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Provide detailed information about your contribution..."
                  className="min-h-[120px] resize-none bg-background/50 border-white/10 focus:border-accent/40"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="links" className="text-sm font-medium">
                Relevant Links <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="links"
                name="links"
                placeholder="GitHub repos, papers, demos, etc."
                className="bg-background/50 border-white/10 focus:border-accent/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Additional Notes <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Any additional information you'd like to share..."
                className="min-h-[80px] resize-none bg-background/50 border-white/10 focus:border-accent/40"
              />
            </div>

            <Button
              type="submit"
              disabled={!contributionType}
              className="w-full bg-gradient-to-r from-accent/30 to-purple-500/30 hover:from-accent/40 hover:to-purple-500/40 border border-accent/30 hover:border-accent/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-4 w-4 mr-2" />
              Send Contribution
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
              Your contribution has been sent successfully. We appreciate your valuable input!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionForm;
