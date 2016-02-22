module Jekyll
  class TagIndex < Page
    def initialize(site, tag)
      @site = site
      @base = site.source
      @dir = File.join('tags', Utils.slugify(tag))
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(@base, '_layouts'), 'tag_index.html')
      self.data['tag'] = tag
      self.data['title'] = '#' + tag
    end
  end

  class TagGenerator < Generator
    safe true
    def generate(site)
      if site.layouts.key? 'tag_index'
        site.tags.keys.each do |tag|
          write_tag_index(site, tag)
        end
      end
    end

    def write_tag_index(site, tag)
      index = TagIndex.new(site, tag)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)
      site.pages << index
    end
  end
end
